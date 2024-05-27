import Button from '@comps/Button'
import FloatLabelInput from '@comps/FloatLabelInput'
import Menu from '@comps/Menu'
import MenuItem from '@comps/MenuItem'
import config from '@confs/app.config'
import { Reducer, useReducer } from 'react'

enum ActionType {
  OPEN_MENU,
  CREATE_BOARD_MENU,
  CREATE_WORKSPACE_MENU,
  CLOSE_MENU
}

type Action = {
  type: ActionType
  element?: HTMLElement | null
  data?: string | null
}

type State = {
  anchorEl: HTMLElement | null
  openMenu?: ActionType
  createBoard?: {
    boardTitle: string
  } | null
  createWorkspace?: {
    workspaceTitle: string
  } | null
}

const reducer = (state: State, action: Action) => {
  const prev = { ...state, openMenu: action.type } as State
  switch (action.type) {
    case ActionType.OPEN_MENU:
      return {
        ...prev,
        anchorEl: action.element // mở menu, set phần tử anchorEl
      } as State
    case ActionType.CREATE_BOARD_MENU:
      return { ...prev, createBoard: { boardTitle: action.data ?? '' } }
    case ActionType.CREATE_WORKSPACE_MENU:
      return {
        ...prev,
        createWorkspace: {
          workspaceTitle: ''
        }
      } as State
    case ActionType.CLOSE_MENU:
      return { ...prev, anchorEl: null } as State
    default:
      return prev
  }
}

function CreateBoardMenu() {
  const [state, dispatch] = useReducer(reducer, { anchorEl: null } as State)
  const toggleMainMenu = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (state.anchorEl !== null) {
      dispatch({ type: ActionType.CLOSE_MENU })
    } else {
      dispatch({ type: ActionType.OPEN_MENU, element: e.currentTarget })
    }
  }
  const handleCloseMenu = () => {
    dispatch({ type: ActionType.CLOSE_MENU })
  }
  const handleChangeBoardTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({ type: ActionType.CREATE_BOARD_MENU, data: e.currentTarget.value })
  }
  const openCreateBoardMenu = () => {
    dispatch({ type: ActionType.CREATE_BOARD_MENU })
  }
  const openCreateWorkspaceMenu = () => {
    dispatch({ type: ActionType.CREATE_WORKSPACE_MENU })
  }
  console.log('Current state >>> ', state)
  return (
    <>
      <Button
        onClick={toggleMainMenu}
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
        anchorElement={state.anchorEl}
        open={state.anchorEl !== null && state.openMenu === ActionType.OPEN_MENU}
        style={{ width: config.mainMenu.width, top: config.header.height }}
        onClose={handleCloseMenu}
      >
        <MenuItem onClick={openCreateBoardMenu}>Create board</MenuItem>
        <MenuItem onClick={openCreateWorkspaceMenu}>Create workspace</MenuItem>
      </Menu>
      <Menu
        anchorElement={state.anchorEl}
        open={state.anchorEl !== null && state.openMenu === ActionType.CREATE_BOARD_MENU}
        style={{ width: config.mainMenu.width, top: config.header.height }}
        onClose={handleCloseMenu}
      >
        <FloatLabelInput
          onChange={handleChangeBoardTitle}
          label='Board title'
          input={{ id: 'create-board', autoFocus: true }}
        />
        <Button disabled={!state.createBoard?.boardTitle} style={{ marginTop: '1rem', fontSize: '0.9rem' }}>
          Create board
        </Button>
      </Menu>

      <Menu
        anchorElement={state.anchorEl}
        open={state.anchorEl !== null && state.openMenu === ActionType.CREATE_WORKSPACE_MENU}
        style={{ width: config.mainMenu.width, top: config.header.height }}
        onClose={handleCloseMenu}
      >
        <FloatLabelInput
          // onChange={handleChangeBoardTitle}
          label='Board title'
          input={{ id: 'create-board', autoFocus: true }}
        />
        <Button disabled={!state.createBoard?.boardTitle} style={{ marginTop: '1rem', fontSize: '0.9rem' }}>
          Create workspace
        </Button>
      </Menu>
    </>
  )
}

export default CreateBoardMenu
