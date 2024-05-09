import DropdownMenu from '@comps/DropdownMenu'
import './MainMenu.scss'
import MenuItem from '@comps/MenuItem'
import MenuGroup from '@comps/MenuGroup'
import Button from '@comps/Button'
import { useState } from 'react'

function MainMenu() {
  const [click, setClick] = useState(false)
  return (
    <>
      <div className='main-menu'>
        <h1 className='main-menu-header-text'>Trello</h1>
        <div style={{ position: 'relative' }}>
          <p className={`menu-title ${click ? 'open' : ''}`} onClick={() => setClick(!click)}>
            Workspace
          </p>
          {click && (
            <DropdownMenu
              handleToggleMenu={() => {
                setClick(!click)
              }}
              style={{ width: '300px' }}
            >
              <MenuGroup title={{ content: 'Your Workspace' }} divisor>
                <MenuItem children='My workspace 1.1' />
                <MenuItem children='My workspace 1.2' />
              </MenuGroup>
              <MenuItem children='My workspace 2' />
            </DropdownMenu>
          )}
        </div>

        {/* <DropdownMenu title={{ content: <span> Recent </span> }} style={{ width: '300px' }}>
          <MenuItem children='My Recent 1' />
          <MenuItem children='My Recent 2' />
          <MenuItem children='My Recent 3' />
        </DropdownMenu>
        <DropdownMenu title={{ content: <span> Pinned </span> }} style={{ width: '300px' }}>
          <MenuItem children='My Pinned 1' />
          <MenuItem children='My Pinned 2' />
          <MenuItem children='My Pinned 3' />
        </DropdownMenu> */}
        <Button variant='filled' style={{ padding: '0.6rem 0.7rem' }}>
          Create
        </Button>
      </div>
    </>
  )
}

export default MainMenu
