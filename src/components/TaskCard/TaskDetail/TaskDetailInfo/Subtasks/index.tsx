import './Subtasks.scss'
import { useEffect, useState } from 'react'
import AddSubtask from './AddSubtask'
import SubtaskItem from './SubtaskItem'
import { SubtaskForBoard } from '@utils/types'
import HttpClient from '@utils/HttpClient'
import { HttpStatusCode } from 'axios'

const http = new HttpClient()

function Subtasks({ subtasks, taskId }: { subtasks: SubtaskForBoard[]; taskId: string }) {
  const [_subtasks, setSubtasks] = useState<SubtaskForBoard[]>([])
  useEffect(() => {
    setSubtasks(subtasks)
  }, [subtasks])
  const handleAddTask = async (names: string[]) => {
    const res = await http.postAuth('/subtasks', { names, taskId })
    if (res?.status === HttpStatusCode.Ok) {
      const newSubtasks = [..._subtasks, ...res.data]
      setSubtasks(newSubtasks)
    }
  }
  const handleCheckSubtask = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id } = e.target
    const subtaskId = parseInt(id.split('-')[1]) // lấy subtask id

    const newSubtasks = [...subtasks]
    const updatedSubtask = newSubtasks.find(subtask => subtask.id === subtaskId)

    if (!updatedSubtask) return

    const res = await http.putAuth(`/subtasks/${updatedSubtask?.id}/change-status`, { isCompleted: e.target.checked })
    if (res?.status === HttpStatusCode.Ok) {
      // update lại trạng thái subtask
      if (res?.data) {
        updatedSubtask!.isCompleted = res?.data
        setSubtasks(newSubtasks)
      } else {
        alert('No permission to change subtask status')
      }
    }
  }
  return (
    <>
      <div className='subtasks'>
        <p>
          <i className='fa-solid fa-list-check'></i> Subtasks {_subtasks.length > 0 ? `(${_subtasks.length})` : ''}
        </p>
        {_subtasks?.map(subTask => (
          <SubtaskItem key={subTask.id} subTask={subTask} onCheckTask={handleCheckSubtask} />
        ))}
        <div>
          <AddSubtask onAddTask={handleAddTask} />
        </div>
      </div>
    </>
  )
}

export default Subtasks
