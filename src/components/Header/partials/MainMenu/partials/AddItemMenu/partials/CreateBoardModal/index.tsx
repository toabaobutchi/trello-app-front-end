import Button from '@comps/Button'
import FloatLabelInput from '@comps/FloatLabelInput'
import Modal from '@comps/Modal'
import SelectList from '@comps/SelectList'
import Flex from '@comps/StyledComponents/Flex'
import SwitchButton from '@comps/SwitchButton'
import './CreateBoardModal.scss'
import { useState } from 'react'
import ColorPicker from '@comps/ColorPicker'
import TextArea from '@comps/TextArea'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '@redux/store'
import { BoardDataInput, CreateProjectModel, ProjectContextResponse } from '@utils/types'
import HttpClient from '@utils/HttpClient'
import { HttpStatusCode } from 'axios'
import { useNavigate } from 'react-router-dom'
import { linkCreator } from '@routes/router'
import { addWorkspace } from '@redux/WorkspaceSlice'

const http = new HttpClient()

type CreateBoardModalProps = {
  open: boolean
  onClose?: () => void
}

const initValue: BoardDataInput = {
  title: '',
  useColor: true,
  color: '#007bc2',
  selectedWorkspace: '',
  description: undefined,
  dueDate: ''
}

function CreateBoardModal({ open, onClose = () => {} }: CreateBoardModalProps) {
  const [boardData, setBoardData] = useState<BoardDataInput>(initValue)
  const navigate = useNavigate()
  const ownWorkspace = useSelector((state: RootState) => state.workspaces.workspaceList)
  const handleClose = () => {
    onClose()
    setBoardData(initValue)
  }

  const handleChangeBoard = {
    toggleSetDueDate(e: React.ChangeEvent<HTMLInputElement>) {
      setBoardData({ ...boardData, dueDate: e.currentTarget.checked ? undefined : '' })
    },
    inputs(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
      setBoardData({ ...boardData, [e.currentTarget.name]: e.target.value })
    },
    selectedWorkspace({ value }: { value: string }) {
      setBoardData({ ...boardData, selectedWorkspace: value })
    },
    toggleUseColor(e: React.ChangeEvent<HTMLInputElement>) {
      setBoardData({ ...boardData, useColor: e.currentTarget.checked })
    }
  }

  const handleSubmit = async () => {
    const data: CreateProjectModel = {
      name: boardData.title,
      workspaceId: boardData.selectedWorkspace || ownWorkspace[0].id,
      color: boardData.useColor ? boardData.color : undefined,
      description: boardData.description,
      dueDate: boardData.dueDate ? new Date(boardData.dueDate).getTime() : undefined
    }
    if (!data.name) {
      console.log('Please enter a name')
      return
    }
    const res = await http.postAuth('/projects', data)
    if (res?.status === HttpStatusCode.Ok) {
      handleClose()
      const createdProject = res.data as ProjectContextResponse
      navigate(
        linkCreator.project({
          viewMode: 'board',
          projectId: createdProject?.id ?? '',
          slug: createdProject?.slug ?? '',
          ownerShip: createdProject.context
        })
      )
    }
  }
  return (
    <>
      <Modal
        layout={{ header: { title: 'Add new project', closeIcon: true } }}
        open={open}
        onClose={handleClose}
        className='create-board-modal'
      >
        {ownWorkspace && ownWorkspace.length > 0 && (
          <>
            <FloatLabelInput
              label='Project name'
              input={{ id: 'create-board', name: 'title', autoFocus: true, value: boardData.title }}
              onChange={handleChangeBoard.inputs}
            />

            <Flex className='mt-1' $gap='0.5rem' $alignItem='center'>
              <div className='row gap-1'>
                <SwitchButton
                  inputAttributes={{ type: 'checkbox', id: 'use-color', checked: boardData.useColor }}
                  size='small'
                  onChange={handleChangeBoard.toggleUseColor}
                  theme={{
                    checked: 'primary'
                  }}
                />
                <label style={{ cursor: 'pointer' }} htmlFor='use-color'>
                  Use background color
                </label>
              </div>
              {boardData.useColor && (
                <ColorPicker
                  label={{
                    content: (
                      <span className='row gap-1'>
                        <i className='fa-solid fa-chevron-right'></i> Select project color:
                      </span>
                    )
                  }}
                  input={{ id: 'project-color', value: boardData.color, name: 'color' }}
                  // style={{ marginTop: '0.5rem', marginLeft: '1rem' }}
                  onChange={handleChangeBoard.inputs}
                />
              )}
            </Flex>

            <Flex $alignItem='center' $gap='0.5rem' className='mt-1'>
              <p>Select a workspace:</p>
              <SelectList
                onChoose={handleChangeBoard.selectedWorkspace}
                items={ownWorkspace?.map(workspace => ({ value: workspace.id.toString(), display: workspace.name }))}
                size='small'
              />
            </Flex>
            <Flex className='mt-1' $gap='0.5rem' $alignItem='center'>
              <SwitchButton
                inputAttributes={{ type: 'checkbox', id: 'set-dute-date', checked: boardData.dueDate === undefined }}
                size='small'
                onChange={handleChangeBoard.toggleSetDueDate}
                theme={{
                  checked: 'primary'
                }}
              />
              <label style={{ cursor: 'pointer' }} htmlFor='set-dute-date'>
                I do not want to set due date
              </label>
              {boardData.dueDate !== undefined && (
                <input
                  type='datetime-local'
                  value={boardData.dueDate}
                  name='dueDate'
                  id='due-date-selector'
                  onChange={handleChangeBoard.inputs}
                />
              )}
            </Flex>

            <TextArea
              label='Description (optional)'
              name='description'
              value={boardData.description}
              onChange={handleChangeBoard.inputs}
            />

            <Flex $justifyContent='end'>
              <Button
                size='medium'
                onClick={handleSubmit}
                disabled={!boardData.title.trim()}
                style={{ marginTop: '1rem' }}
              >
                Add board
              </Button>
            </Flex>
          </>
        )}
        {!ownWorkspace ||
          (ownWorkspace.length <= 0 && (
            <>
              <NoWorkspaceWarningModal />
            </>
          ))}
      </Modal>
    </>
  )
}

function NoWorkspaceWarningModal() {
  const [workspaceName, setWorkspaceName] = useState('')
  const dispatch = useDispatch<AppDispatch>()
  const hanleChangeWorkspaceName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setWorkspaceName(e.target.value)
  }
  const handleSubmit = () => {
    if (workspaceName) {
      dispatch(addWorkspace({ name: workspaceName }))
    }
  }
  return (
    <>
      <Flex
        $alignItem='center'
        $gap='1rem'
        $justifyContent='center'
        $flexDirection='column'
        style={{ width: '100%', height: '100%' }}
      >
        <p className='text-warning'>You currently do not have workspace. Please create one and try again</p>
        <Flex $alignItem='center' $justifyContent='center' $gap='0.5rem' style={{ width: '100%' }}>
          <FloatLabelInput
            label='Create your workspace'
            input={{
              id: 'create-workspace-input-in-no-workspace-warning-modal',
              value: workspaceName,
              autoFocus: true
            }}
            onChange={hanleChangeWorkspaceName}
            style={{ width: '70%' }}
          />
          <Button onClick={handleSubmit} variant='filled' size='large'>
            Create <i className='fa-solid fa-plus'></i>
          </Button>
        </Flex>
      </Flex>
    </>
  )
}

export default CreateBoardModal
