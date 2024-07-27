import Button from '@comps/Button'
import Flex from '@comps/StyledComponents/Flex'
import Tooltip from '@comps/Tooltip-v2'
import { RootState } from '@redux/store'
import { AssignmentResponse, ProjectMemberPageParams } from '@utils/types'
import { useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { linkCreator } from '@routes/router'
import { useEffect, useState } from 'react'

type MemberItemProps = {
  member: AssignmentResponse
}

function ProjectMemberItem({ member }: MemberItemProps) {
  const onlineMembers = useSelector((state: RootState) => state.project.activeProject.onlineMembers)
  const [isOnline, setIsOnline] = useState(false)
  const params = useParams() as ProjectMemberPageParams
  const navigate = useNavigate()
  const handleToggleProfile = () => {
    if (params.memberId && params.memberId === member.id) {
      navigate(linkCreator.projectMember(params))
    } else navigate(linkCreator.projectMember(params, member.id))
  }
  useEffect(() => {
    setIsOnline(onlineMembers?.includes(member.id) ?? false)
  }, [member.id, onlineMembers])
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
          <Tooltip content='Kick the member out' arrow delay='0.5s'>
            <Button variant='text' theme='danger'>
              <i className='fa-solid fa-arrow-right-from-bracket'></i>
            </Button>
          </Tooltip>
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
