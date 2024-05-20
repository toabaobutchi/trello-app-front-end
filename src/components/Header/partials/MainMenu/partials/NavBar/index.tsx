import MenuItem from '@comps/MenuItem'
import Button from '@comps/Button'
import { useState } from 'react'
import Menu from '@comps/Menu'
import './NavBar.scss'

type AnchorElements = {
  [key: string]: HTMLElement | null
}

function NavBar() {
  const [anchorEls, setAnchorEls] = useState<AnchorElements>({
    ['workspace-menu-toggle-btn']: null,
    ['recent-menu-toggle-btn']: null,
    ['pinned-menu-toggle-btn']: null,
    ['nav-bar-mobile-menu-button']: null,
    ['active']: null
  })
  const handleButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEls({
      ...anchorEls,
      [e.currentTarget?.id ?? 'no-element']: e.currentTarget as HTMLElement,
      ['active']: e.currentTarget as HTMLElement
    })
  }
  const handleClose = (id: string) => {
    if(anchorEls['active']?.id === id) {
      setAnchorEls({
       ...anchorEls,
        ['active']: null
      })
    }
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
            anchorEls['active']?.id === 'workspace-menu-toggle-btn' ? ' open' : ''
          }`}
          onClick={handleButtonClick}
          id='workspace-menu-toggle-btn'
        >
          <span>Workspace</span> &nbsp;<i className='fa-solid fa-chevron-down'></i>
        </Button>
        <Menu
          anchorElement={anchorEls['workspace-menu-toggle-btn']}
          open={anchorEls['active']?.id === 'workspace-menu-toggle-btn'}
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
            anchorEls['active']?.id === 'recent-menu-toggle-btn' ? ' open' : ''
          }`}
          onClick={handleButtonClick}
          id='recent-menu-toggle-btn'
        >
          <span>Recent</span> &nbsp;<i className='fa-solid fa-chevron-down'></i>
        </Button>
        <Menu
          anchorElement={anchorEls['recent-menu-toggle-btn']}
          open={anchorEls['active']?.id === 'recent-menu-toggle-btn'}
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
            anchorEls['active']?.id === 'pinned-menu-toggle-btn' ? ' open' : ''
          }`}
          onClick={handleButtonClick}
          id='pinned-menu-toggle-btn'
        >
          <span>Pinned</span> &nbsp;<i className='fa-solid fa-chevron-down'></i>
        </Button>
        <Menu
          anchorElement={anchorEls['pinned-menu-toggle-btn']}
          open={anchorEls['active']?.id === 'pinned-menu-toggle-btn'}
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
            anchorEls['active']?.id === 'nav-bar-mobile-menu-button' ? ' open' : ''
          }`}
          onClick={handleButtonClick}
          id='nav-bar-mobile-menu-button'
        >
          <span>More</span> &nbsp;<i className='fa-solid fa-chevron-down'></i>
        </Button>
        <Menu
          anchorElement={anchorEls['nav-bar-mobile-menu-button']}
          open={anchorEls['active']?.id === 'nav-bar-mobile-menu-button'}
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
