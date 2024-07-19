import Button from '@comps/Button'
import Flex from '@comps/StyledComponents/Flex'
import Tooltip from '@comps/Tooltip-v2'
import { RootState } from '@redux/store'
import { AssignmentResponse } from '@utils/types'
import { useState } from 'react'
import { useSelector } from 'react-redux'
import ProjectMemberProfile from './ProjectMemberProfile'

type MemberItemProps = {
  member: AssignmentResponse
}

function ProjectMemberItem({ member }: MemberItemProps) {
  const onlineMembers = useSelector((state: RootState) => state.project.activeProject.onlineMembers)
  const [profileExpanded, setProfileExpanded] = useState(false)
  const isOnline = onlineMembers?.includes(member.id) ?? false
  const handleToggleProfile = () => {
    setProfileExpanded(!profileExpanded)
  }
  return (
    <>
      <Flex $alignItem='center' $flexWrap='wrap' $gap='1rem' key={member.id} className='member-info-row'>
        <div className={`member-info-avatar`}>
          <img src={member.avatar} alt='avatar' />
        </div>
        <div className='member-info-name'>
          <p className='row gap-1'>
            {member?.displayName} {isOnline && <span className='active-text'>{isOnline ? 'Active' : ''}</span>}
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
              <i className='fa-regular fa-id-card'></i>
            </Button>
          </Tooltip>
        </Flex>
        {profileExpanded && <ProjectMemberProfile member={member} />}
      </Flex>
    </>
  )
}

export default ProjectMemberItem
