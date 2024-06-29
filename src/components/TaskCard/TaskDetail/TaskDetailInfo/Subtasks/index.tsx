import './Subtasks.scss'
import { useState } from 'react'
import AddSubtask from './AddSubtask'
import SubtaskItem from './SubtaskItem'

export type SubtaskType = {
  id: number
  title: string
  status?: boolean
  assignee?: {
    displayName?: string
    avatar: string
    email: string
  }
  dueDate?: number
}

function Subtasks() {
  const [subtasks, setSubtasks] = useState<SubtaskType[]>([])
  const handleAddTask = (title: string) => {
    setSubtasks([...subtasks, { id: Date.now(), title } as SubtaskType])
  }
  const handleCheckSubtask = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id } = e.target
    const subtaskId = parseInt(id.split('-')[1])

    const newSubtasks = [...subtasks]
    const updatedSubtask = newSubtasks.find(subtask => subtask.id === subtaskId)
    updatedSubtask!.status = e.target.checked
    setSubtasks(newSubtasks)
  }
  return (
    <>
      <div className='subtasks'>
        <p>
          <i className='fa-solid fa-list-check'></i> Subtasks
        </p>
        {subtasks?.map(subTask => (
          <SubtaskItem subTask={subTask} onCheckTask={handleCheckSubtask} />
        ))}
        <div>
          <AddSubtask onAddTask={handleAddTask} />
        </div>
      </div>
    </>
  )
}

export default Subtasks
