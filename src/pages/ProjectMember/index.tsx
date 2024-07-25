import { RootState } from '@redux/store'
import { useSelector } from 'react-redux'
import { Outlet } from 'react-router-dom'
import './ProjectMember.scss'
import ProjectMemberFilter from './ProjectMemberFilter'
import ProjectMemberItem from './ProjectMemberItem'
import Flex from '@comps/StyledComponents'

function ProjectMember() {
  const { members: projectMembers } = useSelector((state: RootState) => state.project.activeProject)
  return (
    <>
      <Flex $flexDirection='column' $gap='1rem' className='w-full project-member-container'>
        <ProjectMemberFilter />
        <Flex $justifyContent='space-between' className='w-full' $gap='1rem'>
          <Flex $alignItem='center' $flexDirection='column' $gap='0.5rem'>
            {projectMembers.map(member => (
              <ProjectMemberItem key={member.id} member={member} />
            ))}
          </Flex>
          <Outlet />
        </Flex>
      </Flex>
    </>
  )
}

export default ProjectMember
