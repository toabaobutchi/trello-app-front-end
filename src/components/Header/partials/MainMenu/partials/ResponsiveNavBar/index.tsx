import MenuItem from '@comps/MenuItem'
import Button from '@comps/Button'
import './ResponsiveNavBar.scss'
import Menu from '@comps/Menu'

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

function ResponsiveNavBar({
  anchorElement = null,
  setAnchorElement = () => {},
  handleClose = () => {},
  menuItems = []
}: ResponsiveNavBarProps) {
  const handleToggleMenu = (e: React.MouseEvent<HTMLElement>) => {
    setAnchorElement(e.currentTarget as HTMLElement)
  }
  return (
    <>
      <Button
        variant='text'
        size='small'
        theme='default'
        style={{ fontSize: 'inherit' }}
        className={`header-toggle-menu-button nav-bar-mobile-menu-button`}
        onClick={handleToggleMenu}
        toggle-id='nav-bar-mobile-menu-button'
      >
        <span>More</span> &nbsp;<i className='fa-solid fa-chevron-down'></i>
      </Button>
      <Menu
        anchorElement={anchorElement}
        open={anchorElement?.getAttribute('toggle-id') === 'nav-bar-mobile-menu-button'}
        style={{ width: '300px', top: '3.43rem' }}
        onClose={handleClose}
        className='nav-bar-mobile-menu'
      >
        {menuItems.map(item => (
          <MenuItem key={item.toggleId} onClick={handleToggleMenu} toggle-id={item.toggleId}>
            <span>{item.title}</span> <i className='fa-solid fa-chevron-right'></i>
          </MenuItem>
        ))}
      </Menu>
    </>
  )
}

export default ResponsiveNavBar
