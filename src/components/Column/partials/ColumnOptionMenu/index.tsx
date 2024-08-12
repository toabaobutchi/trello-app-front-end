import Button from '@comps/Button'
import { Action, State, reducer, initialState, actions, EActionType } from '@comps/Column/reducer'
import FloatLabelInput from '@comps/FloatLabelInput'
import Menu from '@comps/Menu'
import MenuHeaderWithAction from '@comps/MenuHeaderWithAction'
import MenuItem from '@comps/MenuItem'
import Modal from '@comps/Modal'
import Flex from '@comps/StyledComponents'
import toast from '@comps/Toast/toast'
import { useModal } from '@hooks/useModal'
import { projectSlice } from '@redux/ProjectSlice'
import { deleteList, updateList } from '@services/list.services'
import { handleTriggerKeyPress } from '@utils/functions'
import { hubs, ProjectHub } from '@utils/Hubs'
import { InputChange, ListResponseForBoard } from '@utils/types'
import { memo, useReducer, useRef, useState } from 'react'
import { useDispatch } from 'react-redux'

const ColumnOptionMenu = memo(({ list }: { list?: ListResponseForBoard }) => {
  const [state, dispatch] = useReducer<React.Reducer<State, Action>>(reducer, initialState)
  const reduxDispatch = useDispatch()
  const buttonRef = useRef<HTMLButtonElement>(null)
  const [deleteModal, handleToggleDeleteModal] = useModal()
  const [projectHub] = useState(new ProjectHub())

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
  const handleConfirmDelete = () => {
    handleCloseMenu()
    handleToggleDeleteModal()
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
    if (!wip || !list?.id) return
    else if (isNaN(parseInt(wip))) {
      console.log(`${wip} is not a number`)
      return
    }
    const validWip = parseInt(wip)
    updateList(list.id, { wipLimit: validWip }).then(res => {
      if (res?.isSuccess) {
        const data = res.data
        reduxDispatch(projectSlice.actions.updateListInfo(data))
        handleCloseMenu()
      } else {
        console.log('Update WIP limit failed')
      }
    })
  }
  const handleDeleteList = async () => {
    if (list?.id) {
      const res = await deleteList(list.id)
      if (res?.isSuccess) {
        toast.success('Successfully deleted', '')
        const data = res.data
        reduxDispatch(projectSlice.actions.deleteList(data))
        handleToggleDeleteModal()
        handleCloseMenu()
        if (projectHub.isConnected) {
          projectHub.connection?.invoke(hubs.project.send.deleteList, data)
        }
      }
    }
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
        // style={{ width: '100px' }}
        onPointerDown={e => e.stopPropagation()}
        open={state?.openMenu === EActionType.OPEN_MAINMENU}
        anchorElement={state?.anchorEl as HTMLElement}
        onClose={handleCloseMenu}
      >
        <MenuItem className='text-danger hover-bg-danger' onClick={handleConfirmDelete}>
          <i className='fa-regular fa-trash-can'></i>&nbsp; Delete list
        </MenuItem>
        <MenuItem className='text-warning hover-bg-warning' onClick={handleOpenWIPMenu}>
          <i className='fa-solid fa-lock'></i>&nbsp; Set WIP Limit
        </MenuItem>
      </Menu>
      <Menu
        onPointerDown={e => e.stopPropagation()}
        style={{ width: '200px' }}
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
        <WIPMenu minWIP={list?.tasks?.length} onSubmit={handleSubmitWIP} onClose={handleCloseMenu} />
      </Menu>
      <Modal
        style={{ width: '30%' }}
        layout={{
          header: { title: <p className='text-danger'>Delete list</p>, closeIcon: true },
          footer: (
            <>
              <Flex $alignItem='center' $gap='1rem'>
                <Button onClick={handleToggleDeleteModal} variant='filled' theme='warning'>
                  Cancel
                </Button>
                {!list?.tasks ||
                  (list?.tasks?.length <= 0 && (
                    <Button onClick={handleDeleteList} variant='filled' theme='danger'>
                      Delete
                    </Button>
                  ))}
              </Flex>
            </>
          )
        }}
        open={deleteModal}
        onClose={handleToggleDeleteModal}
      >
        {list?.tasks && list?.tasks?.length > 0 ? (
          <>
            <h3>Some tasks were lelf behind!</h3>
            <p> Please move them to another list before delete and try again!</p>
          </>
        ) : (
          <>
            <p>
              Delete list <span className='text-danger bold'>{list?.name ?? '[ ... ]'}</span> ?
            </p>
          </>
        )}
      </Modal>
    </>
  )
})

function WIPMenu({
  minWIP = 1,
  onSubmit = () => {},
  onClose = () => {}
}: {
  minWIP?: number
  onSubmit?: (wip?: string) => void
  onClose?: () => void
}) {
  const [wip, setWip] = useState(minWIP)
  const handleSubmit = () => {
    onSubmit(wip + '')
    onClose()
  }
  const triggerSubmit = handleTriggerKeyPress(() => {
    handleSubmit()
  }, 'Enter')
  const handleChangeWIP = (e: InputChange) => {
    const value = parseInt(e.target.value)
    if (value >= minWIP || value <= 0) setWip(parseInt(e.target.value))
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
        WIP Limit is stand for <b>Work in progress Limit</b>. Negative value means unlimited
      </p>
      <Button onClick={handleSubmit} variant='filled' theme='primary'>
        Set WIP Limit
      </Button>
    </>
  )
}

export default ColumnOptionMenu
