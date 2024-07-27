import { RootState } from '@redux/store'
import { useSelector } from 'react-redux'
import { Outlet, useOutlet } from 'react-router-dom'
import './ProjectMember.scss'
import ProjectMemberFilter from './ProjectMemberFilter'
import ProjectMemberItem from './ProjectMemberItem'
import Flex from '@comps/StyledComponents'
import Button from '@comps/Button'

function ProjectMember() {
  const { members: projectMembers } = useSelector((state: RootState) => state.project.activeProject)
  const outlet = useOutlet()
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
          {outlet || (
            <p className='flex-1 row gap-1 bold'>
              <span className='text-warning'>
                <i className='fa-solid fa-lightbulb'></i> Tip:
              </span>{' '}
              Click on folder icon{' '}
              <Button variant='text' theme='primary' size='small'>
                <i className='fa-solid fa-folder'></i>
              </Button>{' '}
              to see more about a member
            </p>
          )}
        </Flex>
      </Flex>
    </>
  )
}

export default ProjectMember
