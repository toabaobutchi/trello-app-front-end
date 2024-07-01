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
      updatedSubtask!.isCompleted = res?.data
      setSubtasks(newSubtasks)
    }
  }
  const handleDeleteSubtask = async (subtaskId: number) => {
    const res = await http.deleteAuth(`/subtasks/${subtaskId}`)
    if (res?.status === HttpStatusCode.Ok) {
      const newSubtasks = _subtasks.filter(subtask => subtask.id !== subtaskId)
      setSubtasks(newSubtasks)
    }
  }
  const handleChangeSubtaskName = (sid: number, name: string) => {
    const newSubtasks = [...subtasks]
    const updatedSubtask = newSubtasks.find(subtask => subtask.id === sid)
    if (!updatedSubtask) return
    updatedSubtask.title = name
    setSubtasks(newSubtasks)
  }
  return (
    <>
      <div className='subtasks'>
        <p>
          <i className='fa-solid fa-list-check'></i> Subtasks {_subtasks.length > 0 ? `(${_subtasks.length})` : ''}
        </p>
        {_subtasks?.map(subTask => (
          <SubtaskItem
            key={subTask.id}
            subTask={subTask}
            onCheckSubTask={handleCheckSubtask}
            onDeleteSubtask={handleDeleteSubtask}
            onChangeSubTaskName={handleChangeSubtaskName}
          />
        ))}
        <div>
          <AddSubtask onAddTask={handleAddTask} />
        </div>
      </div>
    </>
  )
}

export default Subtasks
