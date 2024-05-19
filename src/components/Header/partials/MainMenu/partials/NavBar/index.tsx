import MenuItem from '@comps/MenuItem'
import Button from '@comps/Button'
import { useState } from 'react'
import Menu from '@comps/Menu'
import './NavBar.scss'

function NavBar() {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)
  const handleClickToggleButton = (e: React.MouseEvent<HTMLElement>) => {
    if (anchorEl && anchorEl === e.currentTarget) {
      setAnchorEl(null)
    } else {
      setAnchorEl(e.currentTarget)
    }
  }
  const handleClose = () => {
    setAnchorEl(null)
  }
  return (
    <>
      <div className='nav-bar'>
        <Button
          variant='text'
          size='small'
          theme='default'
          style={{ fontSize: 'inherit' }}
          className={`header-toggle-menu-button nav-bar-desktop-button${
            anchorEl?.id === 'workspace-menu-toggle-btn' ? ' open' : ''
          }`}
          onClick={handleClickToggleButton}
          id='workspace-menu-toggle-btn'
        >
          <span>Workspace</span> &nbsp;<i className='fa-solid fa-chevron-down'></i>
        </Button>
        <Menu
          anchorElement={anchorEl}
          open={anchorEl?.id === 'workspace-menu-toggle-btn'}
          style={{ width: '300px', top: '3.43rem' }}
          onClose={handleClose}
        >
          <MenuItem>My Workspace item 1</MenuItem>
          <MenuItem>My Workspace item 2</MenuItem>
          <MenuItem>My Workspace item 3</MenuItem>
        </Menu>

        <Button
          variant='text'
          size='small'
          theme='default'
          style={{ fontSize: 'inherit' }}
          className={`header-toggle-menu-button nav-bar-desktop-button${
            anchorEl?.id === 'recent-menu-toggle-btn' ? ' open' : ''
          }`}
          onClick={handleClickToggleButton}
          id='recent-menu-toggle-btn'
        >
          <span>Recent</span> &nbsp;<i className='fa-solid fa-chevron-down'></i>
        </Button>
        <Menu
          anchorElement={anchorEl}
          open={anchorEl?.id === 'recent-menu-toggle-btn'}
          style={{ width: '300px', top: '3.43rem' }}
          onClose={handleClose}
        >
          <MenuItem>My Recent menu 1</MenuItem>
          <MenuItem>My Recent menu 2</MenuItem>
          <MenuItem>My Recent menu 3</MenuItem>
        </Menu>

        <Button
          variant='text'
          size='small'
          theme='default'
          style={{ fontSize: 'inherit' }}
          className={`header-toggle-menu-button nav-bar-desktop-button${
            anchorEl?.id === 'pinned-menu-toggle-btn' ? ' open' : ''
          }`}
          onClick={handleClickToggleButton}
          id='pinned-menu-toggle-btn'
        >
          <span>Pinned</span> &nbsp;<i className='fa-solid fa-chevron-down'></i>
        </Button>
        <Menu
          anchorElement={anchorEl}
          open={anchorEl?.id === 'pinned-menu-toggle-btn'}
          style={{ width: '300px', top: '3.43rem' }}
          onClose={handleClose}
        >
          <MenuItem>My Pinned menu 1</MenuItem>
          <MenuItem>My Pinned menu 2</MenuItem>
          <MenuItem>My Pinned menu 3</MenuItem>
        </Menu>
        <Button
          variant='text'
          size='small'
          theme='default'
          style={{ fontSize: 'inherit' }}
          className={`header-toggle-menu-button nav-bar-mobile-menu-button${
            anchorEl?.id === 'nav-bar-mobile-menu-button' ? ' open' : ''
          }`}
          onClick={handleClickToggleButton}
          id='nav-bar-mobile-menu-button'
        >
          <span>More</span> &nbsp;<i className='fa-solid fa-chevron-down'></i>
        </Button>
        <Menu
          anchorElement={anchorEl}
          open={anchorEl?.id === 'nav-bar-mobile-menu-button'}
          style={{ width: '300px', top: '3.43rem' }}
          onClose={handleClose}
          className='nav-bar-mobile-menu'
        >
          <MenuItem>
            <span>Workspace</span> <i className='fa-solid fa-chevron-right'></i>
          </MenuItem>
          <MenuItem>
            <span>Recent</span> <i className='fa-solid fa-chevron-right'></i>
          </MenuItem>
          <MenuItem>
            <span>Pinned</span> <i className='fa-solid fa-chevron-right'></i>
          </MenuItem>
        </Menu>
      </div>
    </>
  )
}

export default NavBar
