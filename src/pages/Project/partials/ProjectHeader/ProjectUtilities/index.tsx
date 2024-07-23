import Button from '@comps/Button'
import Menu from '@comps/Menu'
import MenuItem from '@comps/MenuItem'
import useMenu from '@hooks/useMenu'
import routeLinks from '@routes/router'
import { useLocation, useNavigate } from 'react-router-dom'

function ProjectUtilities() {
  const { anchorRef, closeMenu, toggleMenu, open } = useMenu<HTMLButtonElement>()
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const handleNavigateMemberBoard = () => {
    navigate(`${pathname}/${routeLinks.members}`)
    closeMenu()
  }
  return (
    <>
      <Button onClick={toggleMenu} ref={anchorRef} variant='filled'>
        <i className='fa-solid fa-screwdriver-wrench'></i> <span className='project-util-button-text'>Utilities</span>
      </Button>
      <Menu open={open} anchorElement={anchorRef.current} onClose={closeMenu} style={{ width: '300px' }}>
        {/* <MenuItem onClick={handleNavigateShareBoard} className='utils-menu-item'>
          <i className='fa-solid fa-share-nodes'></i> Share project
        </MenuItem> */}
        <MenuItem className='utils-menu-item' onClick={handleNavigateMemberBoard}>
          <i className='fa-solid fa-users-gear'></i> Members
        </MenuItem>
        <MenuItem className='utils-menu-item'>
          <i className='fa-solid fa-timeline fa-fw'></i> Timeline
        </MenuItem>
        <MenuItem className='utils-menu-item'>
          <i className='fa-regular fa-trash-can'></i> Recycle bin
        </MenuItem>
      </Menu>
    </>
  )
}

export default ProjectUtilities
