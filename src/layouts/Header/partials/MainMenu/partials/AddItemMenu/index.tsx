import { boardMenu, joinBoardMenu, mainMenu, workspaceMenu } from './actions'
import MenuHeaderWithAction from '@comps/MenuHeaderWithAction'
import { EActionType, State, reducer } from './reducer'
import FloatLabelInput from '@comps/FloatLabelInput'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '@redux/store'
import TextArea from '@comps/TextArea'
import config from '@confs/app.config'
import { useReducer } from 'react'
import Button from '@comps/Button'
import Menu from '@comps/Menu'
import { addWorkspace } from '@redux/WorkspaceSlice'
import CreateBoardModal from './partials/CreateBoardModal'
import MainMenu from './partials/MainMenu'

function AddItemMenu() {
  const [state, dispatch] = useReducer(reducer, { anchorEl: null } as State)
  const reduxDispatch = useDispatch<AppDispatch>()

  const handleChangeMainMenu = {
    toggle(e: React.MouseEvent<HTMLButtonElement>) {
      if (state.openMenu === EActionType.MAIN_MENU) {
        dispatch(mainMenu.close())
      } else {
        dispatch(mainMenu.open(e.currentTarget as HTMLElement))
      }
    },
    close() {
      dispatch(mainMenu.close())
    },
    back() {
      dispatch(mainMenu.back())
    }
  }
  const handleChangeBoard = {
    open() {
      dispatch(boardMenu.open())
    },
    title(e: React.ChangeEvent<HTMLInputElement>) {
      dispatch(boardMenu.changeTitle(e.currentTarget.value))
    },
    toggleColor(e: React.ChangeEvent<HTMLInputElement>) {
      dispatch(boardMenu.useColor(e.currentTarget.checked))
    },
    color(e: React.ChangeEvent<HTMLInputElement>) {
      dispatch(boardMenu.changeColor(e.currentTarget.value))
    },
    selectedWorkspace({ value }: { value: string }) {
      dispatch(boardMenu.changeSelectedWorkspace(value))
    }
  }
  const handleChangeWorkspace = {
    open() {
      dispatch(workspaceMenu.open())
    },
    title(e: React.ChangeEvent<HTMLInputElement>) {
      dispatch(workspaceMenu.changeTitle(e.currentTarget.value))
    },
    description(e: React.ChangeEvent<HTMLTextAreaElement>) {
      dispatch(workspaceMenu.changeDescription(e.currentTarget.value))
    }
  }

  const handleChangeJoinBoard = {
    open() {
      dispatch(joinBoardMenu.open())
    },
    title(e: React.ChangeEvent<HTMLInputElement>) {
      dispatch(joinBoardMenu.changeBoardId(e.currentTarget.value))
    }
  }
  const handleSubmit = {
    async workspace() {
      if (!state?.workspace?.title?.trim()) {
        console.error('Please enter a workspace title')
      } else {
        // call API to add workspace
        const { title, description } = state.workspace
        reduxDispatch(addWorkspace({ name: title, description }))
        dispatch(mainMenu.close()) // đóng menu
      }
    },
    joinBoard() {}
  }

  const BackButton = (
    <>
      <Button
        style={{ fontSize: '1rem' }}
        onClick={handleChangeMainMenu.back}
        variant='text'
        size='small'
        theme='secondary'
      >
        <i className='fa-solid fa-chevron-left'></i>
      </Button>
    </>
  )
  const CloseButton = (
    <>
      <Button
        style={{ fontSize: '1.2rem' }}
        onClick={handleChangeMainMenu.close}
        variant='text'
        size='small'
        theme='secondary'
      >
        <i className='fa-solid fa-xmark'></i>
      </Button>
    </>
  )
  return (
    <>
      <Button onClick={handleChangeMainMenu.toggle} className='main-menu-create-button' variant='filled'>
        <span className='main-menu-create-button-desktop'>
          Add&nbsp; <i className='fa-solid fa-caret-down'></i>
        </span>
        <span className='main-menu-create-button-mobile'>
          <i className='fa-solid fa-plus'></i>
        </span>
      </Button>
      {/* Main menu */}
      <MainMenu
        open={state.anchorEl !== null && state.openMenu === EActionType.MAIN_MENU}
        anchorElement={state.anchorEl as HTMLElement}
        handleCloseMenu={handleChangeMainMenu.close}
        handleOpenSubMenu={{
          openBoard: handleChangeBoard.open,
          openWorkspace: handleChangeWorkspace.open,
          openJoinBoard: handleChangeJoinBoard.open
        }}
      />
      {/* Board menu */}
      <CreateBoardModal
        open={state.anchorEl !== null && state.openMenu === EActionType.ADD_BOARD_MENU}
        onClose={handleChangeMainMenu.close}
      />

      {/* Workspace menu */}
      <Menu
        anchorElement={state.anchorEl}
        open={state.anchorEl !== null && state.openMenu === EActionType.ADD_WORKSPACE_MENU}
        style={{ width: config.mainMenu.width, top: config.header.height }}
        onClose={handleChangeMainMenu.close}
        header={
          <>
            <MenuHeaderWithAction beforeButton={BackButton} afterButton={CloseButton}>
              Add new workspace
            </MenuHeaderWithAction>
          </>
        }
      >
        <FloatLabelInput
          label='Workspace title'
          input={{ id: 'create-board', autoFocus: true }}
          onChange={handleChangeWorkspace.title}
        />
        <TextArea
          id='workspace-description'
          name='wDesc'
          label='Description (optional)'
          rows={5}
          onChange={handleChangeWorkspace.description}
        />
        <Button
          onClick={handleSubmit.workspace}
          disabled={!state.workspace?.title}
          style={{ marginTop: '1rem', fontSize: '0.9rem' }}
        >
          Create workspace
        </Button>
      </Menu>

      {/* Join board menu */}
      <Menu
        anchorElement={state.anchorEl}
        open={state.anchorEl !== null && state.openMenu === EActionType.JOIN_BOARD_MENU}
        style={{ width: config.mainMenu.width, top: config.header.height }}
        onClose={handleChangeMainMenu.close}
        header={
          <>
            <MenuHeaderWithAction beforeButton={BackButton} afterButton={CloseButton}>
              Join a board
            </MenuHeaderWithAction>
          </>
        }
      >
        <FloatLabelInput
          label='Board id'
          input={{ id: 'create-board', autoFocus: true }}
          onChange={handleChangeJoinBoard.title}
        />
        <Button disabled={true} style={{ marginTop: '1rem', fontSize: '0.9rem' }}>
          Send resquest
        </Button>
      </Menu>
    </>
  )
}

export default AddItemMenu
