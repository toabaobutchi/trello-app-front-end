import Button from '@comps/Button'
import { Reducer, useReducer } from 'react'
import './NavBar.scss'
import reducer from './reducer'
import { closeMenu, mobileOpenMenu, toggleMenu } from './actions'
import Menu from '@comps/Menu'
import config from '@confs/app.config'
import MenuItem from '@comps/MenuItem'
import { Action, State } from './types'
import InfoRow from '@comps/InfoRow'
import CheckBox from '@comps/CheckBox'
import MenuGroup from '@comps/MenuGroup'
import '../ResponsiveNavBar/ResponsiveNavBar.scss'

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
    title: 'Filters',
    toggleId: 'filters-menu-toggle-btn'
  }
]

const mobileToggleButton = 'nav-bar-mobile-menu-button'

function NavBar() {
  const [state, dispatch] = useReducer<Reducer<State, Action>>(reducer, { anchorEl: null })
  const handleToggleMenu = (e: React.MouseEvent<HTMLElement>) => {
    dispatch(toggleMenu(e.currentTarget as HTMLElement, e.currentTarget.getAttribute('toggle-id') ?? ''))
  }
  const handleCloseMenu = () => {
    dispatch(closeMenu())
  }
  const handleChangeMenuInMobileMode = (toggleId: string) => {
    dispatch(mobileOpenMenu(toggleId))
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
              state.openMenu === toggleId ? ' open' : ''
            }`}
            onClick={handleToggleMenu}
            toggle-id={toggleId}
          >
            <span>{title}</span> &nbsp;<i className='fa-solid fa-chevron-down'></i>
          </Button>
        ))}

        <Button
          variant='text'
          size='small'
          theme='default'
          style={{ fontSize: 'inherit' }}
          className={`header-toggle-menu-button nav-bar-mobile-menu-button${
            state.openMenu === mobileToggleButton ? ' open' : ''
          }`}
          onClick={handleToggleMenu}
          toggle-id={mobileToggleButton}
        >
          <span>More</span> &nbsp;<i className='fa-solid fa-chevron-down'></i>
        </Button>
        <Menu
          anchorElement={state.anchorEl as HTMLElement}
          open={Boolean(state.anchorEl) && state.openMenu === mobileToggleButton}
          style={{ width: config.mainMenu.width, top: config.header.height }}
          onClose={handleCloseMenu}
          className='nav-bar-mobile-menu'
        >
          {toggleButtons.map(item => (
            <MenuItem size='small' key={item.toggleId} onClick={() => handleChangeMenuInMobileMode(item.toggleId)} toggle-id={item.toggleId}>
              <span>{item.title}</span> <i className='fa-solid fa-chevron-right'></i>
            </MenuItem>
          ))}
        </Menu>

        <Menu
          anchorElement={state.anchorEl as HTMLElement}
          open={Boolean(state.anchorEl) && state.openMenu === 'workspace-menu-toggle-btn'}
          style={{ width: config.mainMenu.width, top: config.header.height }}
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
          <MenuItem>
            <InfoRow
              layout={{
                imgColor: '#d89e00',
                mainContent: 'My company 1',
                subContent: 'Trello workspace',
                actions: (
                  <>
                    <CheckBox
                      inputAttrs={{ id: 'pinned-checkbox-3', checked: true }}
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
        </Menu>
        <Menu
          anchorElement={state.anchorEl as HTMLElement}
          open={Boolean(state.anchorEl) && state.openMenu === 'recent-menu-toggle-btn'}
          style={{ width: config.mainMenu.width, top: config.header.height }}
          onClose={handleCloseMenu}
        >
          <MenuItem>Luận văn tốt nghiệp</MenuItem>
          <MenuItem>Ứng dụng thời gian thực nhóm 3</MenuItem>
        </Menu>
        <Menu
          anchorElement={state.anchorEl as HTMLElement}
          open={Boolean(state.anchorEl) && state.openMenu === 'filters-menu-toggle-btn'}
          style={{ width: config.mainMenu.width, top: config.header.height }}
          onClose={handleCloseMenu}
        >
          <MenuItem>My Filters menu 1</MenuItem>
          <MenuItem>My Filters menu 2</MenuItem>
          <MenuItem>My Filters menu 3</MenuItem>
        </Menu>
      </div>
    </>
  )
}

export default NavBar
