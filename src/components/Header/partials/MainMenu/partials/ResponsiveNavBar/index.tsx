import MenuItem from '@comps/MenuItem'
import Button from '@comps/Button'
import './ResponsiveNavBar.scss'
import Menu from '@comps/Menu'
import { useState } from 'react'
import MenuGroup from '@comps/MenuGroup'
import InfoRow from '@comps/InfoRow'
import CheckBox from '@comps/CheckBox'

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
  const [toggleId, setToggleId] = useState('')
  const handleToggleMenu = (e: React.MouseEvent<HTMLElement>) => {
    setToggleId(defaultToggleId)
    if (anchorElement && toggleId !== defaultToggleId) {
      setAnchorElement(e.currentTarget as HTMLElement)
    } else if (anchorElement && anchorElement.getAttribute('toggle-id') === defaultToggleId) setAnchorElement(null)
    else {
      setAnchorElement(e.currentTarget as HTMLElement)
    }
  }
  const handleChangeMenu = (e: React.MouseEvent<HTMLElement>) => {
    setToggleId(e.currentTarget.getAttribute('toggle-id') ?? '')
  }
  const handleCloseMenu = () => {
    setToggleId('')
    handleClose()
  }
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
      {/* anchorElement?.getAttribute('toggle-id') === defaultToggleId ||  */}
      <Menu
        anchorElement={anchorElement}
        open={Boolean(anchorElement) && toggleId === defaultToggleId}
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
        <MenuGroup
          title={{
            content: 'Your workspace',
            style: { textTransform: 'capitalize' }
          }}
          divisor
        >
          <MenuItem size='small'>
            <InfoRow
              layout={{
                imgColor: '#2e70ff',
                mainContent: 'Luận văn tốt nghiệp',
                subContent: 'Trello workspace',
                actions: (
                  <>
                    <CheckBox
                      inputAttrs={{ id: 'pinned-checkbox-1', checked: true }}
                      icons={{
                        checked: { icon: <i className='fa-solid fa-star'></i> },
                        unchecked: { icon: <i className='fa-regular fa-star'></i> }
                      }}
                    />
                  </>
                )
              }}
            />
          </MenuItem>
          <MenuItem size='small'>
            <InfoRow
              layout={{
                imgColor: '#e90678',
                mainContent: 'Đồ án chuyên ngành',
                subContent: 'Trello workspace',
                actions: (
                  <>
                    <CheckBox
                      inputAttrs={{ id: 'pinned-checkbox-2', checked: true }}
                      icons={{
                        checked: { icon: <i className='fa-solid fa-star'></i> },
                        unchecked: { icon: <i className='fa-regular fa-star'></i> }
                      }}
                    />
                  </>
                )
              }}
            />
          </MenuItem>
        </MenuGroup>
        <MenuItem>Ứng dụng thời gian thực nhóm 3</MenuItem>
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
        <MenuItem>Luận văn tốt nghiệp</MenuItem>
        <MenuItem>Ứng dụng thời gian thực nhóm 3</MenuItem>
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
