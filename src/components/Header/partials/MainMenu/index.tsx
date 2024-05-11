import DropdownMenu from '@comps/DropdownMenu'
import './MainMenu.scss'
import MenuItem from '@comps/MenuItem'
import MenuGroup from '@comps/MenuGroup'
import Button from '@comps/Button'
import { useState } from 'react'
import Menu from '@comps/Menu'

function MainMenu() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)
  const handleClickToggleButton = (e: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(anchorEl ? null : e.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }
  return (
    <>
      <div className='main-menu'>
        <h1 className='main-menu-header-text'>Trello</h1>
        <DropdownMenu title={{ content: <span> Workspace </span> }} style={{ width: '300px' }}>
          <MenuGroup title={{ content: 'Your Workspace' }} divisor>
            <MenuItem children='My workspace 1.1' />
            <MenuItem children='My workspace 1.2' />
          </MenuGroup>
          <MenuItem children='My workspace 2' />
        </DropdownMenu>
        <DropdownMenu title={{ content: <span> Recent </span> }} style={{ width: '300px' }}>
          <MenuItem children='My Recent 1' />
          <MenuItem children='My Recent 2' />
          <MenuItem children='My Recent 3' />
        </DropdownMenu>
        <DropdownMenu title={{ content: <span> Pinned </span> }} style={{ width: '300px' }}>
          <MenuItem children='My Pinned 1' />
          <MenuItem children='My Pinned 2' />
          <MenuItem children='My Pinned 3' />
        </DropdownMenu>
        <Button variant='filled' style={{ padding: '0.6rem 0.7rem' }}>
          Create
        </Button>
        <Button
          variant='outlined'
          size='small'
          classes={`header-toggle-menu-button${open ? ' open' : ''}`}
          onClick={handleClickToggleButton}
        >
          Open menu
        </Button>
        <Menu anchorElement={anchorEl} open={open} style={{ width: '300px', top: '3.43rem' }} onClose={handleClose}>
          <MenuItem children='My Open menu 1' />
          <MenuItem children='My Open menu 2' />
          <MenuItem children='My Open menu 3' />
        </Menu>
      </div>
    </>
  )
}

export default MainMenu
