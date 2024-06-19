import { Project } from '@utils/types'
import './ProjectCard.scss'
import Flex from '@comps/StyledComponents/Flex'
import Button from '@comps/Button'
import Menu from '@comps/Menu'
import MenuItem from '@comps/MenuItem'
import Tooltip from '@comps/Tooltip'
import useMenu from '@hooks/useMenu'

function ProjectCard({ project }: { project: Project }) {
  // const [moreMenuOpen, setMoreMenuOpen] = useState(false)
  // const handleToggleMenu = () => {
  //   setMoreMenuOpen(!moreMenuOpen)
  // }
  // const handleCloseMenu = () => {
  //   setMoreMenuOpen(false)
  // }
  // const buttonRef = useRef<HTMLButtonElement | null>(null)
  const { open, anchorRef, toggleMenu, closeMenu } = useMenu<HTMLButtonElement>()
  return (
    <>
      <div
        className='project-card'
        style={
          {
            ['--clr']: project.color ?? 'transparent',
            ['--text-clr']: project.color ?? 'inherit'
          } as React.CSSProperties
        }
      >
        <h3 className='project-card-name'>{project.name}</h3>
        <p className='project-card-sub-text'>Create: {new Date(project.createdAt * 1000).toLocaleDateString()}</p>
        <p className='project-card-sub-text'>
          Due date:{' '}
          {project.dueDate ?? (
            <Tooltip content='No specified due date. Update at <code>More > Update</code>' position='right' arrow>
              <Tooltip.Text>[No data]</Tooltip.Text>
            </Tooltip>
          )}
        </p>
        <p className='project-card-description'>
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Delectus consequatur unde velit cupiditate explicabo
          esse modi excepturi? Consectetur nostrum magnam eaque nisi quia non impedit molestias, quis, cumque,
          doloremque perferendis.
        </p>
        <Flex $alignItem='center' $justifyContent='end' $gap='0.5rem' style={{ marginTop: '0.5rem' }}>
          <Button variant='filled'>Take a look</Button>
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
