import Button from '@comps/Button'
import FloatLabelInput from '@comps/FloatLabelInput'
import Menu from '@comps/Menu'
import useMenu from '@hooks/useMenu'
import { projectSlice } from '@redux/ProjectSlice'
import { addNewTask } from '@services/task.services'
import { containsSpecialCharacters, handleTriggerKeyPress } from '@utils/functions'
import { hubs, ProjectHub } from '@utils/Hubs'
import { CreateTaskModel, InputChange, ListResponseForBoard } from '@utils/types'
import { useState } from 'react'
import { useDispatch } from 'react-redux'

function AddTaskAbove({ column }: { column?: ListResponseForBoard }) {
  const addNewTaskMenu = useMenu<HTMLButtonElement>()
  const [newTaskName, setNewTaskName] = useState('')
  const dispatch = useDispatch()
  const [error, setError] = useState('')
  const [projectHub] = useState<ProjectHub>(new ProjectHub())

  const handleChangeNewTaskName = (e: InputChange) => {
    setNewTaskName(e.target.value)
  }
  const handleAddNewTask = async () => {
    if (!newTaskName.trim()) {
      setError('Please enter a name')
      return
    } else if (containsSpecialCharacters(newTaskName)) {
      setError('Task name cannot contain special characters')
      return
    }
    if (newTaskName.trim()) {
      // Add new task to column
      const newTask: CreateTaskModel = {
        listId: column?.id as string,
        name: newTaskName
      }
      const res = await addNewTask(newTask)
      if (res?.isSuccess) {
        addNewTaskMenu.closeMenu()
        setNewTaskName('')
        dispatch(projectSlice.actions.addNewTask(res.data))

        if (projectHub.isConnected) {
          projectHub.connection?.invoke(hubs.project.send.addNewTask, res.data)
        }
      }
    }
  }
  const handleTrigger = handleTriggerKeyPress(() => {
    handleAddNewTask()
  }, 'Enter')
  return (
    <>
      <Button
        ref={addNewTaskMenu.anchorRef}
        onClick={addNewTaskMenu.toggleMenu}
        variant='text'
        theme='default'
        className={`column-header-more-button ${addNewTaskMenu.open ? 'open-button' : ''}`}
      >
        <i className='fa-solid fa-plus'></i>
      </Button>
      <Menu
        open={addNewTaskMenu.open}
        onClose={addNewTaskMenu.closeMenu}
        anchorElement={addNewTaskMenu.anchorRef.current}
      >
        <FloatLabelInput
          label='Task name'
          className='mb-1'
          onChange={handleChangeNewTaskName}
          input={{ id: 'add-task-input-above', value: newTaskName, autoFocus: true, onKeyDown: handleTrigger.handler }}
        />
        {error && <p className='text-danger'>{error}</p>}
        <Button variant='filled' onClick={handleAddNewTask}>
          Add new task
        </Button>
      </Menu>
    </>
  )
}

export default AddTaskAbove
