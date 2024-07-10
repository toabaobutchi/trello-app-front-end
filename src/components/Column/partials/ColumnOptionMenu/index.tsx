import Button from '@comps/Button'
import { Action, State, reducer, initialState, actions, EActionType } from '@comps/Column/reducer'
import FloatLabelInput from '@comps/FloatLabelInput'
import Menu from '@comps/Menu'
import MenuHeaderWithAction from '@comps/MenuHeaderWithAction'
import MenuItem from '@comps/MenuItem'
import { projectSlice } from '@redux/ProjectSlice'
import { handleTriggerKeyPress } from '@utils/functions'
import HttpClient from '@utils/HttpClient'
import { InputChange, UpdatedListResponse } from '@utils/types'
import { memo, useReducer, useRef, useState } from 'react'
import { useDispatch } from 'react-redux'

const http = new HttpClient()

const ColumnOptionMenu = memo(({ listId }: { listId?: string }) => {
  const [state, dispatch] = useReducer<React.Reducer<State, Action>>(reducer, initialState)
  const reduxDispatch = useDispatch()
  const buttonRef = useRef<HTMLButtonElement>(null)
  const handleToggleMenu = () => {
    if (state?.openMenu === undefined) {
      dispatch(actions.openMainMenu(buttonRef.current as HTMLElement))
    } else if (state.openMenu === EActionType.OPEN_MAINMENU) {
      dispatch(actions.closeMenu())
    } else dispatch(actions.closeMenu())
  }
  const handleOpenWIPMenu = () => {
    dispatch(actions.openWIPMenu())
  }
  const handleBackToMainMenu = () => {
    dispatch(actions.backToMainMenu())
  }
  const handleCloseMenu = () => {
    dispatch(actions.closeMenu())
  }
  const BackButton = (
    <>
      <Button style={{ fontSize: '1rem' }} onClick={handleBackToMainMenu} variant='text' size='small' theme='secondary'>
        <i className='fa-solid fa-chevron-left'></i>
      </Button>
    </>
  )
  const CloseButton = (
    <>
      <Button style={{ fontSize: '1.2rem' }} onClick={handleCloseMenu} variant='text' size='small' theme='secondary'>
        <i className='fa-solid fa-xmark'></i>
      </Button>
    </>
  )
  const handleSubmitWIP = (wip?: string) => {
    // kiểm tra giá trị đầu vào
    if (!wip) return
    else if (isNaN(parseInt(wip))) {
      console.log(`${wip} is not a number`)
      return
    }
    const validWip = parseInt(wip)
    http.putAuth(`/lists/${listId}`, { wipLimit: validWip }).then(res => {
      if (res?.status === 200) {
        const data = res?.data as UpdatedListResponse
        reduxDispatch(projectSlice.actions.updateListInfo(data))
        handleCloseMenu()
      } else {
        console.log('Update WIP limit failed')
      }
    })
  }
  return (
    <>
      <Button
        ref={buttonRef}
        onClick={handleToggleMenu}
        onPointerDown={e => e.preventDefault()}
        variant='text'
        theme='default'
        className='column-header-more-button'
      >
        <i className='fa-solid fa-ellipsis'></i>
      </Button>
      <Menu
        onPointerDown={e => e.stopPropagation()}
        open={state?.openMenu === EActionType.OPEN_MAINMENU}
        anchorElement={state?.anchorEl as HTMLElement}
        onClose={handleCloseMenu}
      >
        <MenuItem>
          <i className='fa-regular fa-trash-can'></i>&nbsp; Delete list
        </MenuItem>
        <MenuItem onClick={handleOpenWIPMenu}>
          <i className='fa-solid fa-lock'></i>&nbsp; Set WIP Limit
        </MenuItem>
      </Menu>
      <Menu
        onPointerDown={e => e.stopPropagation()}
        style={{ width: 'max-content' }}
        open={state?.openMenu === EActionType.OPEN_WIPMENU}
        anchorElement={state?.anchorEl as HTMLElement}
        onClose={handleCloseMenu}
        header={
          <>
            <MenuHeaderWithAction beforeButton={BackButton} afterButton={CloseButton}>
              <p>WIP Limit</p>
            </MenuHeaderWithAction>
          </>
        }
      >
        <WIPMenu onSubmit={handleSubmitWIP} onClose={handleCloseMenu} />
      </Menu>
    </>
  )
})

function WIPMenu({
  onSubmit = () => {},
  onClose = () => {}
}: {
  onSubmit?: (wip?: string) => void
  onClose?: () => void
}) {
  const [wip, setWip] = useState('')
  const handleSubmit = () => {
    onSubmit(wip)
    onClose()
  }
  const triggerSubmit = handleTriggerKeyPress(() => {
    handleSubmit()
  }, 'Enter')
  const handleChangeWIP = (e: InputChange) => {
    setWip(e.target.value)
  }
  return (
    <>
      <FloatLabelInput
        label='WIP Limit'
        input={{
          id: 'wip-limit-input',
          type: 'number',
          onKeyDown: triggerSubmit.handler,
          value: wip,
          min: 0
        }}
        onChange={handleChangeWIP}
      />
      <p className='text-secondary my-1'>
        WIP Limit is stand for <b>Work in progress Limit</b>. Value <code>0</code> is unlimited
      </p>
      <Button onClick={handleSubmit} variant='filled' theme='primary'>
        Set WIP Limit
      </Button>
    </>
  )
}

export default ColumnOptionMenu