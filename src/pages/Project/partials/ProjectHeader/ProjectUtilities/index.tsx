import Button from '@comps/Button'
import Menu from '@comps/Menu'
import MenuItem from '@comps/MenuItem'
import useMenu from '@hooks/useMenu'
import { linkCreator } from '@routes/router'
import { ProjectPageParams } from '@utils/types'
import { useNavigate, useParams } from 'react-router-dom'
import ProjectChatRoom from '../../ProjectChatRoom'

function ProjectUtilities() {
  const { anchorRef, closeMenu, toggleMenu, open } = useMenu<HTMLButtonElement>()
  const navigate = useNavigate()
  // const { pathname } = useLocation()
  const params = useParams() as ProjectPageParams
  const handleNavigateMemberBoard = () => {
    navigate(linkCreator.projectMember(params))
    closeMenu()
  }
  const handleNavigateRecycleBin = () => {
    navigate(linkCreator.projectRecycleBin(params))
    closeMenu()
  }
  const handleNavigateChangeLog = () => {
    navigate(linkCreator.changeLog(params))
    closeMenu()
  }
  return (
    <>
      <Button onClick={toggleMenu} ref={anchorRef} variant='filled'>
        <span className='project-util-button-text'>Utilities</span> <i className='fa-solid fa-caret-down'></i>
      </Button>
      <Menu open={open} anchorElement={anchorRef.current} onClose={closeMenu} style={{ width: '300px' }}>
        <MenuItem className='utils-menu-item' onClick={handleNavigateMemberBoard}>
          <i className='fa-solid fa-users-gear'></i> Members
        </MenuItem>
        <MenuItem onClick={handleNavigateChangeLog} className='utils-menu-item'>
          <i className='fa-solid fa-timeline fa-fw'></i> Change logs
        </MenuItem>
        <MenuItem className='utils-menu-item' onClick={handleNavigateRecycleBin}>
          <i className='fa-regular fa-trash-can'></i> Recycle bin
        </MenuItem>
      </Menu>
    </>
  )
}

export default ProjectUtilities
