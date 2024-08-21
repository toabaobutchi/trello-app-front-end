import Button from '@comps/Button'
import Menu from '@comps/Menu_v2'
import MenuItem from '@comps/MenuItem'
import useMenu from '@hooks/useMenu'
import { usePageParams } from '@hooks/usePageParams'
import { linkCreator } from '@routes/router'
import { ProjectPageParams } from '@utils/types/page-params.type'
import { useNavigate } from 'react-router-dom'

function ProjectUtilities() {
  const { closeMenu, toggleMenu, open } = useMenu<HTMLButtonElement>()
  const navigate = useNavigate()
  const params = usePageParams<ProjectPageParams>()
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
      <Button id='utilities-toggle-menu-btn' onClick={toggleMenu} variant='filled'>
        <span className='project-util-button-text'>Utilities</span> <i className='fa-solid fa-caret-down'></i>
      </Button>
      <Menu anchorId='utilities-toggle-menu-btn' open={open} onClose={closeMenu} style={{ width: '300px' }}>
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
