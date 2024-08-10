import Button from '@comps/Button'
import Flex from '@comps/StyledComponents/Flex'
import Tooltip from '@comps/Tooltip-v2'
import { AssignmentResponse, ProjectMemberPageParams } from '@utils/types'
import { useNavigate, useParams } from 'react-router-dom'
import { linkCreator } from '@routes/router'
import { useEffect, useMemo, useState } from 'react'
import { removeAssignment } from '@services/assignment.services'
import { useProjectSelector } from '@hooks/useProjectSelector'
import { hubs, ProjectHub } from '@utils/Hubs'

type MemberItemProps = {
  member: AssignmentResponse
}

function ProjectMemberItem({ member }: MemberItemProps) {
  const { onlineMembers, board: project } = useProjectSelector()
  const [isOnline, setIsOnline] = useState(false)
  const params = useParams() as ProjectMemberPageParams
  const navigate = useNavigate()
  const [projectHub] = useState(new ProjectHub())

  const handleToggleProfile = () => {
    if (params.memberId && params.memberId === member.id) {
      navigate(linkCreator.projectMember(params))
    } else navigate(linkCreator.projectMember(params, member.id))
  }

  const handleDeleteAssignment = async () => {
    const res = await removeAssignment(member.id)
    if (res?.isSuccess) {
      const data = res.data

      if (projectHub.isConnected) {
        console.log('Send data')
        projectHub.connection?.invoke(hubs.project.send.removeAssignment, data)
      }
    }
  }

  useEffect(() => {
    setIsOnline(onlineMembers?.includes(member.id) ?? false)
  }, [member.id, onlineMembers])

  const canBeDeleted = useMemo(() => {
    const permission = member.permission?.toLowerCase()
    const context = project.context.toLowerCase()
    // return permission !== 'owner' && (permission === 'admin' && project.context === 'owner')
    if (permission === 'owner') return false
    else if (permission === 'admin' && context !== 'owner') return false
    return true
  }, [member.permission, project.context])
  return (
    <>
      <Flex
        $alignItem='center'
        $flexWrap='wrap'
        $gap='1rem'
        key={member.id}
        className={`member-info-row ${params.memberId === member.id ? 'profile-expanded' : ''}`}
      >
        <div className={`member-info-avatar`}>
          <img src={member.avatar} alt='avatar' />
        </div>
        <div className='member-info-name'>
          <p className='row gap-2'>
            {member?.displayName}{' '}
            {isOnline && <span className='active-text'>{isOnline ? 'Available for work' : ''}</span>}
          </p>
          <p className='text-secondary'>{member?.email}</p>
        </div>
        <div className='member-info-permission'>{member?.permission}</div>
        <Flex $alignItem='center' $gap='0.25rem' className='member-info-actions'>
          {canBeDeleted && (
            <Tooltip content='Kick the member out' arrow delay='0.5s'>
              <Button onClick={handleDeleteAssignment} variant='text' theme='danger'>
                <i className='fa-solid fa-arrow-right-from-bracket'></i>
              </Button>
            </Tooltip>
          )}
          <Tooltip content='About this member' arrow delay='0.5s'>
            <Button onClick={handleToggleProfile} variant='text' theme='primary'>
              {params.memberId === member.id ? (
                <i className='fa-regular fa-folder-open'></i>
              ) : (
                <i className='fa-solid fa-folder'></i>
              )}
            </Button>
          </Tooltip>
        </Flex>
      </Flex>
    </>
  )
}

export default ProjectMemberItem
