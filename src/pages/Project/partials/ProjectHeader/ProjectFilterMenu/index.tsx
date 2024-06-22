import Button from '@comps/Button'
import Menu from '@comps/Menu'
import useMenu from '@hooks/useMenu'
import { memo } from 'react'

const ProjectFilterMenu = memo(() => {
  const menu = useMenu<HTMLButtonElement>()
  return (
    <>
      <Button ref={menu.anchorRef} onClick={menu.toggleMenu} variant='text' theme='default'>
        <i className='fa-solid fa-filter'></i> Filters <i className='fa-solid fa-caret-down'></i>
      </Button>
      <Menu open={menu.open} anchorElement={menu.anchorRef.current} onClose={menu.closeMenu}>

      </Menu>
    </>
  )
})

export default ProjectFilterMenu
