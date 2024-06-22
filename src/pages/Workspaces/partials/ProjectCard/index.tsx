import { LoadedProjectWithWorkspace } from '@utils/types'
import './ProjectCard.scss'
import Flex from '@comps/StyledComponents/Flex'
import Button from '@comps/Button'
import Menu from '@comps/Menu'
import MenuItem from '@comps/MenuItem'
import Tooltip from '@comps/Tooltip'
import useMenu from '@hooks/useMenu'
import { useNavigate } from 'react-router-dom'
import { linkCreator } from '@routes/router'

function ProjectCard({ project }: { project: LoadedProjectWithWorkspace }) {
  const { open, anchorRef, toggleMenu, closeMenu } = useMenu<HTMLButtonElement>()
  const navigate = useNavigate()
  const navigateToProjectDetail = () => {
    navigate(
      linkCreator.project({ ownerShip: project.context, projectId: project.id, slug: project.slug, viewMode: 'board' })
    )
  }
  return (
    <>
      <div
        className='project-card'
        style={
          {
            ['--clr']: project.color || 'transparent',
            ['--text-clr']: project.color || 'inherit'
          } as React.CSSProperties
        }
      >
        <h3 className='project-card-name'>{project.name}</h3>
        <p className='project-card-sub-text'>Create: {new Date(project.createdAt * 1000).toLocaleDateString()}</p>
        <div className='project-card-sub-text row gap-1'>
          Due date:
          {project.dueDate ?? (
            <Tooltip content='No specified due date. Update at <code>More > Update</code>' position='right' arrow>
              <Tooltip.Text>[No data]</Tooltip.Text>
            </Tooltip>
          )}
        </div>
        <p className='project-card-sub-text'>Member: {project.memberCount}</p>
        <p className='project-card-description'>{project.description}</p>
        <Flex $alignItem='center' $justifyContent='end' $gap='0.5rem' style={{ marginTop: '0.5rem' }}>
          <Button onClick={navigateToProjectDetail} variant='filled'>
            Take a look
          </Button>
          {/*  thay doi thanh `navlink` */}
          <Button ref={anchorRef} variant='text' theme='secondary' className='row' onClick={toggleMenu}>
            More&nbsp;<i className='fa-solid fa-caret-down'></i>
          </Button>
        </Flex>
        <Menu
          // style={{ width: '150px' }}
          open={open}
          anchorElement={anchorRef?.current}
          onClose={closeMenu}
        >
          <MenuItem className='project-update-btn'>
            <i className='fa-regular fa-pen-to-square'></i> Update
          </MenuItem>
          <MenuItem className='project-delete-btn'>
            <i className='fa-regular fa-trash-can'></i> Delete
          </MenuItem>
        </Menu>
      </div>
    </>
  )
}

export default ProjectCard
