import MenuItem from '@comps/MenuItem'
import Button from '@comps/Button'
import { useState } from 'react'
import Menu from '@comps/Menu'
import './NavBar.scss'
import ResponsiveNavBar from '../ResponsiveNavBar'

function NavBar() {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)
  const handleToggleMenu = (e: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(e.currentTarget as HTMLElement)
  }
  const handleCloseMenu = () => {
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
            anchorEl?.getAttribute('toggle-id') === 'workspace-menu-toggle-btn' ? ' open' : ''
          }`}
          onClick={handleToggleMenu}
          toggle-id='workspace-menu-toggle-btn'
        >
          <span>Workspace</span> &nbsp;<i className='fa-solid fa-chevron-down'></i>
        </Button>
        <Menu
          anchorElement={anchorEl}
          open={anchorEl?.getAttribute('toggle-id') === 'workspace-menu-toggle-btn'}
          style={{ width: '300px', top: '3.43rem' }}
          onClose={handleCloseMenu}
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
            anchorEl?.getAttribute('toggle-id') === 'recent-menu-toggle-btn' ? ' open' : ''
          }`}
          onClick={handleToggleMenu}
          toggle-id='recent-menu-toggle-btn'
        >
          <span>Recent</span> &nbsp;<i className='fa-solid fa-chevron-down'></i>
        </Button>
        <Menu
          anchorElement={anchorEl}
          open={anchorEl?.getAttribute('toggle-id') === 'recent-menu-toggle-btn'}
          style={{ width: '300px', top: '3.43rem' }}
          onClose={handleCloseMenu}
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
            anchorEl?.getAttribute('toggle-id') === 'pinned-menu-toggle-btn' ? ' open' : ''
          }`}
          onClick={handleToggleMenu}
          toggle-id='pinned-menu-toggle-btn'
        >
          <span>Pinned</span> &nbsp;<i className='fa-solid fa-chevron-down'></i>
        </Button>
        <Menu
          anchorElement={anchorEl}
          open={anchorEl?.getAttribute('toggle-id') === 'pinned-menu-toggle-btn'}
          style={{ width: '300px', top: '3.43rem' }}
          onClose={handleCloseMenu}
        >
          <MenuItem>My Pinned menu 1</MenuItem>
          <MenuItem>My Pinned menu 2</MenuItem>
          <MenuItem>My Pinned menu 3</MenuItem>
        </Menu>
        <ResponsiveNavBar
          anchorElement={anchorEl}
          setAnchorElement={setAnchorEl}
          handleClose={handleCloseMenu}
          menuItems={[
            {
              title: 'Workspace',
              toggleId: 'workspace-menu-toggle-btn'
            },
            {
              title: 'Recent',
              toggleId: 'recent-menu-toggle-btn'
            },
            {
              title: 'Pinned',
              toggleId: 'pinned-menu-toggle-btn'
            }
          ]}
        />
      </div>
    </>
  )
}

export default NavBar
