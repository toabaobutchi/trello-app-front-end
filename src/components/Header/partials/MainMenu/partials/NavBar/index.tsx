import Button from '@comps/Button'
import Menu from '@comps/Menu'
import MenuItem from '@comps/MenuItem'
import { useState } from 'react'
import './NavBar.scss'

function NavBar() {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)
  const handleClickToggleButton = (e: React.MouseEvent<HTMLElement>) => {
    if (anchorEl?.id === e.currentTarget.id) {
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
          className={`header-toggle-menu-button header-desktop-button${
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
          className={`header-toggle-menu-button header-desktop-button${
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
          <MenuItem>My Open menu 1</MenuItem>
          <MenuItem>My Open menu 2</MenuItem>
          <MenuItem>My Open menu 3</MenuItem>
        </Menu>

        <Button
          variant='text'
          size='small'
          theme='default'
          style={{ fontSize: 'inherit' }}
          className={`header-toggle-menu-button header-desktop-button${
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
          <MenuItem>My Open menu 1</MenuItem>
          <MenuItem>My Open menu 2</MenuItem>
          <MenuItem>My Open menu 3</MenuItem>
        </Menu>
      </div>
    </>
  )
}

export default NavBar
