import Button from '@comps/Button'
import FloatLabelInput from '@comps/FloatLabelInput'
import Menu from '@comps/Menu'
import useMenu from '@hooks/useMenu'
import { projectSlice } from '@redux/ProjectSlice'
import HttpClient from '@utils/HttpClient'
import { CreateTaskModel, InputChange, ListResponseForBoard } from '@utils/types'
import { useState } from 'react'
import { useDispatch } from 'react-redux'

const http = new HttpClient()

function AddTaskAbove({ column }: { column?: ListResponseForBoard }) {
  const addNewTaskMenu = useMenu<HTMLButtonElement>()
  const [newTaskName, setNewTaskName] = useState('')
  const dispatch = useDispatch()
  const handleChangeNewTaskName = (e: InputChange) => {
    setNewTaskName(e.target.value)
  }
  const handleAddNewTask = async () => {
    if (newTaskName) {
      // Add new task to column
      const newTask: CreateTaskModel = {
        listId: column?.id as string,
        name: newTaskName
      }
      const res = await http.postAuth('/tasks', newTask)
      if (res?.status === 200) {
        addNewTaskMenu.closeMenu()
        setNewTaskName('')
        dispatch(projectSlice.actions.addNewTask(res.data))
      }
    }
  }
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
          input={{ id: 'add-task-input-above', value: newTaskName, autoFocus: true }}
        />
        <Button variant='filled' onClick={handleAddNewTask}>
          Add new task
        </Button>
      </Menu>
    </>
  )
}

export default AddTaskAbove
