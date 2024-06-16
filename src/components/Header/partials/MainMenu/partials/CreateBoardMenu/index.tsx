import { boardMenu, joinBoardMenu, mainMenu, workspaceMenu } from './actions'
import MenuHeaderWithAction from '@comps/MenuHeaderWithAction'
import { EActionType, State, reducer } from './reducer'
import { ToastContainer, toast } from 'react-toastify'
import FloatLabelInput from '@comps/FloatLabelInput'
import Flex from '@comps/StyledComponents/Flex'
import SwitchButton from '@comps/SwitchButton'
import 'react-toastify/dist/ReactToastify.css'
import ColorPicker from '@comps/ColorPicker'
import SelectList from '@comps/SelectList'
import useAccount from '@hooks/useAccount'
import HttpClient from '@utils/HttpClient'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '@redux/store'
import MenuItem from '@comps/MenuItem'
import TextArea from '@comps/TextArea'
import config from '@confs/app.config'
import Tooltip from '@comps/Tooltip'
import { useReducer } from 'react'
import Button from '@comps/Button'
import Menu from '@comps/Menu'
import { addWorkspace } from '@redux/WorkspaceSlice'
import { Workspace } from '@utils/types'

const itemMarginTop = '0.5rem'
const http = new HttpClient()

function CreateBoardMenu() {
  const [state, dispatch] = useReducer(reducer, { anchorEl: null } as State)
  const workspaceList = useSelector((state: RootState) => state.workspaces.workspaceList)
  const reduxDispatch = useDispatch<AppDispatch>()
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
    async board() {
      if (!workspaceList) {
        toast.error('You have no workspace')
      }
    },
    async workspace() {
      if (!state?.workspace?.title?.trim()) {
        toast.error('Please enter a workspace title')
      } else {
        // call API to add workspace
        const { title, description } = state.workspace as { title: string; description: string }
        const result = await http.postAuth(
          `/u/${account.accountInfo.id}/workspaces`,
          { name: title, description },
          account.accessToken
        )
        if (result?.status === 200 && result?.data?.status === true) {
          reduxDispatch(addWorkspace({ data: result?.data?.data as Workspace, loginInfo: account }))
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
      {/* Main menu */}
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

      {/* Board menu */}
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
          items={workspaceList?.map(workspace => ({ value: workspace.id.toString(), display: workspace.name }))}
        />
        <Tooltip
          content={!state.board?.title?.trim() ? '<p style="color: #ff0048;">Please enter board title</p>' : ''}
          arrow
          position='right'
          theme='gray'
        >
          <Button
            onClick={handleSubmit.board}
            disabled={!state.board?.title?.trim()}
            style={{ marginTop: '1rem', fontSize: '0.9rem' }}
          >
            Add board
          </Button>
        </Tooltip>
      </Menu>

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

      <ToastContainer />
    </>
  )
}

export default CreateBoardMenu
