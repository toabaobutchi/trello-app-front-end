import Button from '@comps/Button'
import './WorkspaceTreeMenu.scss'
import useMenu from '@hooks/useMenu'
import Menu from '@comps/Menu'
import MenuItem from '@comps/MenuItem'

// dựa vào dữ liệu của activeWorkspace trong store để sử dụng
function WorkspaceTreeMenu() {
  const menu = useMenu<HTMLButtonElement>()
  return (
    <>
      <Button
        ref={menu.anchorRef}
        onClick={menu.toggleMenu}
        className={`${menu.open ? 'click-button__open' : ''}`}
        variant='text'
        theme={`${menu.open ? 'primary' : 'default'}`}
      >
        <i className='fa-solid fa-folder-tree'></i>
      </Button>
      <Menu
        style={{ width: '200px', fontSize: '1.1rem' }}
        onClose={menu.closeMenu}
        open={menu.open}
        anchorElement={menu.anchorRef.current}
      >
        <MenuItem className='row gap-1'><i className="fa-solid fa-flag"></i> Workspace 1</MenuItem>
        <MenuItem className='project-nav-link current-active row jcsb'>Project 1.1 <span><i className="fa-regular fa-folder-open active-icon"></i></span></MenuItem>
        <MenuItem className='project-nav-link'>Project 1.2 <span><i className="fa-regular fa-folder-open active-icon"></i></span></MenuItem>
        <MenuItem className='project-nav-link'>Project 1.3 <span><i className="fa-regular fa-folder-open active-icon"></i></span></MenuItem>
      </Menu>
    </>
  )
}

export default WorkspaceTreeMenu
