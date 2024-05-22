import MenuItem from '@comps/MenuItem'
import Button from '@comps/Button'
import './ResponsiveNavBar.scss'
import Menu from '@comps/Menu'
import { useState } from 'react'

type MenuItemType = {
  title: string
  toggleId: string
}

interface ResponsiveNavBarProps {
  anchorElement?: HTMLElement | null
  // eslint-disable-next-line no-unused-vars
  setAnchorElement?: React.Dispatch<React.SetStateAction<HTMLElement | null>>
  handleClose?: () => void
  menuItems?: MenuItemType[]
}

const defaultToggleId = 'nav-bar-mobile-menu-button'

function ResponsiveNavBar({
  anchorElement = null,
  setAnchorElement = () => {},
  handleClose = () => {},
  menuItems = []
}: ResponsiveNavBarProps) {
  const [toggleId, setToggleId] = useState(defaultToggleId)
  const handleToggleMenu = (e: React.MouseEvent<HTMLElement>) => {
    if (anchorElement && toggleId !== defaultToggleId) {
      setAnchorElement(e.currentTarget as HTMLElement)
      setToggleId(defaultToggleId)
    } else if (anchorElement && anchorElement.getAttribute('toggle-id') === defaultToggleId) setAnchorElement(null)
    else {
      setAnchorElement(e.currentTarget as HTMLElement)
    }
  }
  const handleChangeMenu = (e: React.MouseEvent<HTMLElement>) => {
    setToggleId(e.currentTarget.getAttribute('toggle-id') ?? defaultToggleId)
  }
  const handleCloseMenu = () => {
    setToggleId(defaultToggleId)
    handleClose()
  }
  console.log({ anchorElement }, toggleId)
  return (
    <>
      <Button
        variant='text'
        size='small'
        theme='default'
        style={{ fontSize: 'inherit' }}
        className={`header-toggle-menu-button nav-bar-mobile-menu-button${
          anchorElement?.getAttribute('toggle-id') === defaultToggleId ? ' open' : ''
        }`}
        onClick={handleToggleMenu}
        toggle-id={defaultToggleId}
      >
        <span>More</span> &nbsp;<i className='fa-solid fa-chevron-down'></i>
      </Button>

      {Boolean(anchorElement) &&
        (anchorElement?.getAttribute('toggle-id') === defaultToggleId || toggleId === defaultToggleId) && (
          <Menu
            anchorElement={anchorElement}
            open
            style={{ width: '300px', top: '3.43rem' }}
            onClose={handleCloseMenu}
            className='nav-bar-mobile-menu'
          >
            {menuItems.map(item => (
              <MenuItem size='small' key={item.toggleId} onClick={handleChangeMenu} toggle-id={item.toggleId}>
                <span>{item.title}</span> <i className='fa-solid fa-chevron-right'></i>
              </MenuItem>
            ))}
          </Menu>
        )}
      <Menu
        anchorElement={anchorElement}
        open={
          Boolean(anchorElement) &&
          (anchorElement?.getAttribute('toggle-id') === 'workspace-menu-toggle-btn' ||
            toggleId === 'workspace-menu-toggle-btn')
        }
        style={{ width: '300px', top: '3.43rem' }}
        onClose={handleCloseMenu}
      >
        <MenuItem>My Workspace item 1</MenuItem>
        <MenuItem>My Workspace item 2</MenuItem>
        <MenuItem>My Workspace item 3</MenuItem>
      </Menu>
      <Menu
        anchorElement={anchorElement}
        open={
          Boolean(anchorElement) &&
          (anchorElement?.getAttribute('toggle-id') === 'recent-menu-toggle-btn' ||
            toggleId === 'recent-menu-toggle-btn')
        }
        style={{ width: '300px', top: '3.43rem' }}
        onClose={handleCloseMenu}
      >
        <MenuItem>My Recent menu 1</MenuItem>
        <MenuItem>My Recent menu 2</MenuItem>
        <MenuItem>My Recent menu 3</MenuItem>
      </Menu>
      <Menu
        anchorElement={anchorElement}
        open={
          Boolean(anchorElement) &&
          (anchorElement?.getAttribute('toggle-id') === 'pinned-menu-toggle-btn' ||
            toggleId === 'pinned-menu-toggle-btn')
        }
        style={{ width: '300px', top: '3.43rem' }}
        onClose={handleCloseMenu}
      >
        <MenuItem>My Pinned menu 1</MenuItem>
        <MenuItem>My Pinned menu 2</MenuItem>
        <MenuItem>My Pinned menu 3</MenuItem>
      </Menu>
    </>
  )
}

export default ResponsiveNavBar
