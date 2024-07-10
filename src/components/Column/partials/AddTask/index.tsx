import Button from '@comps/Button'
import FloatLabelInput from '@comps/FloatLabelInput'
import Flex from '@comps/StyledComponents/Flex'
import useClickTracker from '@hooks/useClickTracker'
import { HubConnection } from '@microsoft/signalr'
import { projectSlice } from '@redux/ProjectSlice'
import { RootState } from '@redux/store'
import HttpClient from '@utils/HttpClient'
import { CreateTaskModel, CreateTaskResponse, InputChange, ListResponseForBoard } from '@utils/types'
import { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

const http = new HttpClient()

function AddTask({ column, hubConnection }: { column?: ListResponseForBoard; hubConnection?: HubConnection }) {
  const [isAddingTask, setIsAddingTask] = useState(false)
  const handleToggleAddTask = () => {
    setIsAddingTask(!isAddingTask)
  }
  useEffect(() => {
    if (hubConnection) {
      // hubConnection.on('')
    }
  }, [hubConnection])
  return (
    <>
      {!isAddingTask ? (
        <Button variant='text' onClick={handleToggleAddTask}>
          <i className='fa-solid fa-plus'></i> Add a task ...
        </Button>
      ) : (
        <AddTaskInput hubConnection={hubConnection} onCancelAddTask={handleToggleAddTask} column={column} />
      )}
    </>
  )
}

function AddTaskInput({
  onCancelAddTask,
  column,
  hubConnection
}: {
  onCancelAddTask: () => void
  column?: ListResponseForBoard
  hubConnection?: HubConnection
}) {
  const [addTask, setAddTask] = useState<string>('')
  const projectId = useSelector((state: RootState) => state.project.activeProject.board?.id)
  const accountId = useSelector((state: RootState) => state.login.accountInfo?.id)
  const dispatch = useDispatch()
  const handleChangeTaskName = (e: InputChange) => {
    setAddTask(e.target.value)
  }
  const addTaskInputContainerRef = useRef<HTMLDivElement>(null)
  const { outClick } = useClickTracker(addTaskInputContainerRef.current as HTMLElement)
  useEffect(() => {
    if (outClick.isOutClick) {
      onCancelAddTask()
    }
  }, [onCancelAddTask, outClick])
  const handleAddTask = async () => {
    if (!addTask) {
      console.log('Please enter a task name')
    } else {
      if (!column?.id) {
        console.log('Can not create when list id is not provided')
        return
      }
      const newTask: CreateTaskModel = {
        listId: column?.id,
        name: addTask
      }
      const res = await http.postAuth('/tasks', newTask)
      if (res?.status === 200) {
        const data = res?.data as CreateTaskResponse
        onCancelAddTask()
        dispatch(projectSlice.actions.addNewTask(data))
        console.log('hub connection: ', hubConnection)
        if (hubConnection) {
          hubConnection.invoke('SendAddNewTask', projectId, accountId, data)
        }
      }
    }
  }
  return (
    <>
      <Flex ref={addTaskInputContainerRef} $flexDirection='column' $gap='1rem'>
        <FloatLabelInput
          style={{ width: '100%' }}
          label='Task name'
          input={{ autoFocus: true, value: addTask, id: 'add-task-input' }}
          onChange={handleChangeTaskName}
        />
        <Flex $alignItem='center' $gap='0.5rem'>
          <Button onClick={handleAddTask} variant='filled'>
            Add task
          </Button>
          <Button variant='text' theme='default' onClick={onCancelAddTask}>
            <i className='fa-solid fa-xmark'></i>
          </Button>
        </Flex>
      </Flex>
    </>
  )
}

export default AddTask
