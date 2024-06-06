import Button from '@comps/Button'
import ColorPicker from '@comps/ColorPicker'
import FloatLabelInput from '@comps/FloatLabelInput'
import Menu from '@comps/Menu'
import MenuHeaderWithAction from '@comps/MenuHeaderWithAction'
import MenuItem from '@comps/MenuItem'
import SelectList from '@comps/SelectList'
import config from '@confs/app.config'
import { useReducer } from 'react'

enum EActionType {
  OPEN_MENU,
  ADD_BOARD_MENU,
  ADD_WORKSPACE_MENU,
  JOIN_BOARD_MENU,
  CLOSE_MENU
}

type Action = {
  type: EActionType
  element?: HTMLElement | null
  data?: string | null
}

type State = {
  anchorEl: HTMLElement | null
  openMenu?: EActionType
  createBoard?: {
    boardTitle: string
  } | null
  createWorkspace?: {
    workspaceTitle: string
  } | null
  joinBoard?: {
    boardId: string
  } | null
}

const reducer = (state: State, action: Action) => {
  const prev = { ...state, openMenu: action.type } as State
  switch (action.type) {
    case EActionType.OPEN_MENU:
      return {
        ...prev,
        anchorEl: action.element ?? prev.anchorEl // mở menu, set phần tử anchorEl
      } as State
    case EActionType.ADD_BOARD_MENU:
      return { ...prev, createBoard: { boardTitle: action.data ?? '' } }
    case EActionType.ADD_WORKSPACE_MENU:
      return {
        ...prev,
        createWorkspace: {
          workspaceTitle: ''
        }
      } as State
    case EActionType.JOIN_BOARD_MENU:
      return {
        ...prev,
        joinBoard: {
          boardId: ''
        }
      } as State
    case EActionType.CLOSE_MENU:
      return { ...prev, anchorEl: null } as State
    default:
      return prev
  }
}

const itemMarginTop = '0.5rem'

function CreateBoardMenu() {
  const [state, dispatch] = useReducer(reducer, { anchorEl: null } as State)
  const toggleMainMenu = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (state.anchorEl !== null) {
      dispatch({ type: EActionType.CLOSE_MENU })
    } else {
      dispatch({ type: EActionType.OPEN_MENU, element: e.currentTarget })
    }
  }
  const backToMainMenu = () => {
    dispatch({ type: EActionType.OPEN_MENU })
  }
  const handleCloseMenu = () => {
    dispatch({ type: EActionType.CLOSE_MENU })
  }
  const handleChangeBoardTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({ type: EActionType.ADD_BOARD_MENU, data: e.currentTarget.value })
  }
  const openCreateBoardMenu = () => {
    dispatch({ type: EActionType.ADD_BOARD_MENU })
  }
  const openCreateWorkspaceMenu = () => {
    dispatch({ type: EActionType.ADD_WORKSPACE_MENU })
  }
  const openJoinBoardMenu = () => {
    dispatch({ type: EActionType.JOIN_BOARD_MENU })
  }
  const BackButton = (
    <>
      <Button style={{ fontSize: '1rem' }} onClick={backToMainMenu} variant='text' size='small' theme='secondary'>
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
  return (
    <>
      <Button
        onClick={toggleMainMenu}
        className='main-menu-create-button'
        variant='filled'
        style={{ padding: '0.6rem 0.7rem' }}
      >
        <span className='main-menu-create-button-desktop'>Add</span>
        <span className='main-menu-create-button-mobile'>
          <i className='fa-solid fa-plus'></i>
        </span>
      </Button>
      <Menu
        anchorElement={state.anchorEl}
        open={state.anchorEl !== null && state.openMenu === EActionType.OPEN_MENU}
        style={{ width: config.mainMenu.width, top: config.header.height }}
        onClose={handleCloseMenu}
      >
        <MenuItem size='small' onClick={openCreateBoardMenu}>
          <div className='row jcsb'>
            <p>Add new board</p>
            <i className='fa-solid fa-chevron-right'></i>
          </div>
        </MenuItem>
        <MenuItem size='small' onClick={openCreateWorkspaceMenu}>
          <div className='row jcsb'>
            <p>Add workspace</p>
            <i className='fa-solid fa-chevron-right'></i>
          </div>
        </MenuItem>
        <MenuItem size='small' onClick={openJoinBoardMenu}>
          <div className='row jcsb'>
            <p>Join a board</p>
            <i className='fa-solid fa-chevron-right'></i>
          </div>
        </MenuItem>
      </Menu>
      <Menu
        anchorElement={state.anchorEl}
        open={state.anchorEl !== null && state.openMenu === EActionType.ADD_BOARD_MENU}
        style={{ width: config.mainMenu.width, top: config.header.height }}
        onClose={handleCloseMenu}
        header={
          <>
            <MenuHeaderWithAction beforeButton={BackButton} afterButton={CloseButton}>
              Add new board
            </MenuHeaderWithAction>
          </>
        }
      >
        <FloatLabelInput
          onChange={handleChangeBoardTitle}
          label='Board title'
          input={{ id: 'create-board', autoFocus: true }}
        />
        <ColorPicker
          label={{ content: 'Choose background color for project:', style: { marginTop: itemMarginTop } }}
          input={{ id: 'project-color' }}
        />
        <SelectList
          label={{ content: 'Select workspace:', style: { marginTop: itemMarginTop } }}
          items={[
            { value: 'work-space-1', display: 'Workspace 1' },
            { value: 'work-space-2', display: 'Workspace 2' },
            { value: 'work-space-3', display: 'Workspace 3' }
          ]}
        />
        <Button disabled={!state.createBoard?.boardTitle} style={{ marginTop: '1rem', fontSize: '0.9rem' }}>
          Add board
        </Button>
      </Menu>

      <Menu
        anchorElement={state.anchorEl}
        open={state.anchorEl !== null && state.openMenu === EActionType.ADD_WORKSPACE_MENU}
        style={{ width: config.mainMenu.width, top: config.header.height }}
        onClose={handleCloseMenu}
        header={
          <>
            <MenuHeaderWithAction beforeButton={BackButton} afterButton={CloseButton}>
              Add new workspace
            </MenuHeaderWithAction>
          </>
        }
      >
        <FloatLabelInput
          // onChange={handleChangeBoardTitle}
          label='Workspace title'
          input={{ id: 'create-board', autoFocus: true }}
        />
        <Button disabled={!state.createBoard?.boardTitle} style={{ marginTop: '1rem', fontSize: '0.9rem' }}>
          Create workspace
        </Button>
      </Menu>

      <Menu
        anchorElement={state.anchorEl}
        open={state.anchorEl !== null && state.openMenu === EActionType.JOIN_BOARD_MENU}
        style={{ width: config.mainMenu.width, top: config.header.height }}
        onClose={handleCloseMenu}
        header={
          <>
            <MenuHeaderWithAction beforeButton={BackButton} afterButton={CloseButton}>
              Join a board
            </MenuHeaderWithAction>
          </>
        }
      >
        <FloatLabelInput label='Board id' input={{ id: 'create-board', autoFocus: true }} />
        <Button disabled={!state.createBoard?.boardTitle} style={{ marginTop: '1rem', fontSize: '0.9rem' }}>
          Send resquest
        </Button>
      </Menu>
    </>
  )
}

export default CreateBoardMenu
