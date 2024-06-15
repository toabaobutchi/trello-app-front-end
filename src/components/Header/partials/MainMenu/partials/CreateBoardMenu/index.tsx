import Button from '@comps/Button'
import ColorPicker from '@comps/ColorPicker'
import FloatLabelInput from '@comps/FloatLabelInput'
import Menu from '@comps/Menu'
import MenuHeaderWithAction from '@comps/MenuHeaderWithAction'
import MenuItem from '@comps/MenuItem'
import SelectList from '@comps/SelectList'
import TextArea from '@comps/TextArea'
import config from '@confs/app.config'
import { useReducer } from 'react'
import { boardMenu, joinBoardMenu, mainMenu, setError, workspaceMenu } from './actions'
import { EActionType, State, reducer } from './reducer'
import HttpClient from '@utils/HttpClient'
import useAccount from '@hooks/useAccount'
import SwitchButton from '@comps/SwitchButton'
import Flex from '@comps/StyledComponents/Flex'

const itemMarginTop = '0.5rem'
const workspaceList = [
  { value: '1', display: 'Workspace 1' },
  { value: '2', display: 'Workspace 2' },
  { value: '3', display: 'Workspace 3' }
]

const http = new HttpClient()

function CreateBoardMenu() {
  const [state, dispatch] = useReducer(reducer, { anchorEl: null } as State)
  const account = useAccount()

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
    board() {},
    async workspace() {
      if (state.workspace?.title?.trim() === '') {
        setError('Please enter workspace title')
      } else {
        // call API to add workspace
        const { title, description } = state.workspace as { title: string; description: string }
        const result = await http.postAuth(
          `/u/${account.accountInfo.id}/workspaces`,
          { name: title, description },
          account.accessToken
        )
        if (result?.status === 200 && result?.data?.status === true) {
          dispatch(mainMenu.close())
        }
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
        <span className='main-menu-create-button-desktop'>Add</span>
        <span className='main-menu-create-button-mobile'>
          <i className='fa-solid fa-plus'></i>
        </span>
      </Button>
      <Menu
        anchorElement={state.anchorEl}
        open={state.anchorEl !== null && state.openMenu === EActionType.MAIN_MENU}
        style={{ width: config.mainMenu.width, top: config.header.height }}
        onClose={handleChangeMainMenu.close}
      >
        <MenuItem size='small' onClick={handleChangeBoard.open}>
          <div className='row jcsb'>
            <p>Add new board</p>
            <i className='fa-solid fa-chevron-right'></i>
          </div>
        </MenuItem>
        <MenuItem size='small' onClick={handleChangeWorkspace.open}>
          <div className='row jcsb'>
            <p>Add workspace</p>
            <i className='fa-solid fa-chevron-right'></i>
          </div>
        </MenuItem>
        <MenuItem size='small' onClick={handleChangeJoinBoard.open}>
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
        onClose={handleChangeMainMenu.close}
        header={
          <>
            <MenuHeaderWithAction beforeButton={BackButton} afterButton={CloseButton}>
              Add new board
            </MenuHeaderWithAction>
          </>
        }
      >
        <FloatLabelInput
          onChange={handleChangeBoard.title}
          label='Board title'
          input={{ id: 'create-board', autoFocus: true, value: state.board?.title ?? '' }}
        />
        <p className='text-danger'>{state.error}</p>
        <Flex className='mt-1' $gap='0.5rem' $alignItem='center'>
          <SwitchButton
            inputAttributes={{ type: 'checkbox', id: 'use-color' }}
            size='small'
            onChange={handleChangeBoard.toggleColor}
          />
          <label style={{ cursor: 'pointer' }} htmlFor='use-color'>
            Use background color
          </label>
        </Flex>
        {state.board?.color !== undefined && (
          <ColorPicker
            style={{ marginTop: itemMarginTop }}
            label={{ content: 'Choose background color:' }}
            input={{ id: 'project-color' }}
            onChange={handleChangeBoard.color}
          />
        )}
        <SelectList
          label={{ content: 'Select workspace:', style: { marginTop: itemMarginTop } }}
          onChoose={handleChangeBoard.selectedWorkspace}
          items={workspaceList}
        />
        <Button disabled={!state.board?.title} style={{ marginTop: '1rem', fontSize: '0.9rem' }}>
          Add board
        </Button>
      </Menu>

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
        <p className='text-danger'>{state.error}</p>
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
        <p className='text-danger'>{state.error}</p>
        <Button disabled={true} style={{ marginTop: '1rem', fontSize: '0.9rem' }}>
          Send resquest
        </Button>
      </Menu>
    </>
  )
}

export default CreateBoardMenu
