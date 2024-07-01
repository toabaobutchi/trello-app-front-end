import './Subtasks.scss'
import { useEffect, useState } from 'react'
import AddSubtask from './AddSubtask'
import SubtaskItem from './SubtaskItem'
import { SubtaskForBoard } from '@utils/types'

function Subtasks({ subtasks }: { subtasks: SubtaskForBoard[] }) {
  const [_subtasks, setSubtasks] = useState<SubtaskForBoard[]>([])
  useEffect(() => {
    setSubtasks(subtasks)
  }, [subtasks])
  const handleAddTask = (title: string) => {
    // setSubtasks([...subtasks, { id: Date.now(), title } as SubtaskType])
  }
  const handleCheckSubtask = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id } = e.target
    const subtaskId = parseInt(id.split('-')[1])

    const newSubtasks = [...subtasks]
    const updatedSubtask = newSubtasks.find(subtask => subtask.id === subtaskId)
    // updatedSubtask!.status = e.target.checked
    setSubtasks(newSubtasks)
  }
  return (
    <>
      <div className='subtasks'>
        <p>
          <i className='fa-solid fa-list-check'></i> Subtasks
        </p>
        {_subtasks?.map(subTask => (
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
