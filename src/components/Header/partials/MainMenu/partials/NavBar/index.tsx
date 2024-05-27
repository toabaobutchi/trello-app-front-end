import Button from '@comps/Button'
import { useState } from 'react'
import './NavBar.scss'
import ResponsiveNavBar from '../ResponsiveNavBar'

type MenuItemType = {
  title: string
  toggleId: string
}
const toggleButtons: MenuItemType[] = [
  {
    title: 'Workspaces',
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
]
function NavBar() {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)
  const handleToggleMenu = (e: React.MouseEvent<HTMLElement>) => {
    if (anchorEl && anchorEl.getAttribute('toggle-id') === e.currentTarget.getAttribute('toggle-id')) setAnchorEl(null)
    else setAnchorEl(e.currentTarget as HTMLElement)
  }
  const handleCloseMenu = () => {
    setAnchorEl(null)
  }
  return (
    <>
      <div className='nav-bar'>
        {toggleButtons.map(({ title, toggleId }) => (
          <Button
            key={toggleId}
            variant='text'
            size='small'
            theme='default'
            style={{ fontSize: 'inherit' }}
            className={`header-toggle-menu-button nav-bar-desktop-button${
              anchorEl?.getAttribute('toggle-id') === toggleId ? ' open' : ''
            }`}
            onClick={handleToggleMenu}
            toggle-id={toggleId}
          >
            <span>{title}</span> &nbsp;<i className='fa-solid fa-chevron-down'></i>
          </Button>
        ))}
        <ResponsiveNavBar
          anchorElement={anchorEl}
          setAnchorElement={setAnchorEl}
          handleClose={handleCloseMenu}
          menuItems={toggleButtons}
        />
      </div>
    </>
  )
}

export default NavBar
