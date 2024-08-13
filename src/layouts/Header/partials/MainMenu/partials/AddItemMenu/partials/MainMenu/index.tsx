import Menu from '@comps/Menu'
import MenuItem from '@comps/MenuItem'
import config from '@confs/app.config'

type MainMenuProps = {
  open: boolean
  anchorElement: HTMLElement
  handleCloseMenu?: () => void
  handleOpenSubMenu?: {
    openBoard: () => void
    openWorkspace: () => void
    openJoinBoard: () => void
  }
}

function MainMenu({ open, anchorElement, handleCloseMenu = () => {}, handleOpenSubMenu }: MainMenuProps) {
  return (
    <>
      <Menu
        anchorElement={anchorElement}
        open={open}
        style={{ width: config.mainMenu.width, top: config.header.height }}
        onClose={handleCloseMenu}
      >
        <MenuItem size='small' onClick={handleOpenSubMenu?.openBoard}>
          <div className='row jcsb'>
            <p>Add new board</p>
            <i className='fa-solid fa-chevron-right'></i>
          </div>
        </MenuItem>
        <MenuItem size='small' onClick={handleOpenSubMenu?.openWorkspace}>
          <div className='row jcsb'>
            <p>Add workspace</p>
            <i className='fa-solid fa-chevron-right'></i>
          </div>
        </MenuItem>
        {/* <MenuItem size='small' onClick={handleOpenSubMenu?.openJoinBoard}>
          <div className='row jcsb'>
            <p>Join a board</p>
            <i className='fa-solid fa-chevron-right'></i>
          </div>
        </MenuItem> */}
      </Menu>
    </>
  )
}

export default MainMenu
