import Button from '@comps/Button'
import FloatLabelInput from '@comps/FloatLabelInput'
import Flex from '@comps/StyledComponents/Flex'
import useClickTracker from '@hooks/useClickTracker'
import { projectSlice } from '@redux/ProjectSlice'
import { hubs, ProjectHub } from '@utils/Hubs'
import { CreateTaskModel, InputChange, ListResponseForBoard } from '@utils/types'
import { useEffect, useRef, useState } from 'react'
import { useDispatch } from 'react-redux'
import { addNewTask } from '@services/task.services'
import { containsSpecialCharacters, handleTriggerKeyPress } from '@utils/functions'
import toast from '@comps/Toast/toast'

function AddTask({ column }: { column?: ListResponseForBoard }) {
  const [isAddingTask, setIsAddingTask] = useState(false)
  const handleToggleAddTask = () => {
    setIsAddingTask(!isAddingTask)
  }
  return (
    <>
      {!isAddingTask ? (
        <Button variant='text' onClick={handleToggleAddTask}>
          <i className='fa-solid fa-plus'></i> Add a task ...
        </Button>
      ) : (
        <AddTaskInput onCancelAddTask={handleToggleAddTask} column={column} />
      )}
    </>
  )
}

function AddTaskInput({ onCancelAddTask, column }: { onCancelAddTask: () => void; column?: ListResponseForBoard }) {
  const [addTask, setAddTask] = useState<string>('')
  const [projectHub] = useState<ProjectHub>(new ProjectHub())
  const dispatch = useDispatch()
  const [error, setError] = useState('')

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
    if (!addTask.trim()) {
      setError('Please enter a task name')
    } else if (containsSpecialCharacters(addTask)) {
      setError('Task name cannot contain special characters')
      return
    } else {
      if (!column?.id?.trim()) {
        toast.error('Can not create when list id is not provided', '')
        return
      }

      const newTask: CreateTaskModel = {
        listId: column?.id,
        name: addTask
      }
      const res = await addNewTask(newTask)
      if (res?.isSuccess) {
        const data = res.data
        onCancelAddTask()
        dispatch(projectSlice.actions.addNewTask(data))

        if (projectHub.isConnected) {
          projectHub.connection?.invoke(hubs.project.send.addNewTask, data)
        }
      }
    }
  }
  const handleTrigger = handleTriggerKeyPress(() => {
    handleAddTask()
  }, 'Enter')
  return (
    <>
      <Flex ref={addTaskInputContainerRef} $flexDirection='column' $gap='1rem'>
        <FloatLabelInput
          style={{ width: '100%' }}
          label='Task name'
          input={{ autoFocus: true, value: addTask, id: 'add-task-input', onKeyDown: handleTrigger.handler }}
          onChange={handleChangeTaskName}
        />
        {error && <p className='text-danger'>{error}</p>}
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
