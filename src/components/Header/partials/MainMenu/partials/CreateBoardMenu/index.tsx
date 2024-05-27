import Button from '@comps/Button'
import FloatLabelInput from '@comps/FloatLabelInput'
import Menu from '@comps/Menu'
import config from '@confs/app.config'
import { useState } from 'react'

function CreateBoardMenu() {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)
  const [boardTitle, setBoardTitle] = useState('')
  const handleToggleMenu = (e: React.MouseEvent<HTMLElement>) => {
    if (anchorEl) setAnchorEl(null)
    else setAnchorEl(e.currentTarget as HTMLElement)
  }
  const handleCloseMenu = () => {
    setAnchorEl(null)
  }
  const handleChangeBoardTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBoardTitle(e.target.value)
  }
  return (
    <>
      <Button
        onClick={handleToggleMenu}
        className='main-menu-create-button'
        variant='filled'
        style={{ padding: '0.6rem 0.7rem' }}
      >
        <span className='main-menu-create-button-desktop'>Create</span>
        <span className='main-menu-create-button-mobile'>
          <i className='fa-solid fa-plus'></i>
        </span>
      </Button>
      <Menu
        anchorElement={anchorEl}
        open={anchorEl !== null}
        style={{ width: config.mainMenu.width, top: config.header.height }}
        onClose={handleCloseMenu}
      >
        <FloatLabelInput
          onChange={handleChangeBoardTitle}
          label='Board title'
          input={{ id: 'create-board', autoFocus: true }}
        />
        <Button disabled={!boardTitle} style={{ marginTop: '1rem', fontSize: '0.9rem' }}>
          Create board
        </Button>
      </Menu>
    </>
  )
}

export default CreateBoardMenu
