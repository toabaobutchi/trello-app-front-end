import './Subtasks.scss'
import { useEffect, useState } from 'react'
import AddSubtask from './AddSubtask'
import SubtaskItem from './SubtaskItem'
import { SubtaskForBoard, SubtaskResponse } from '@utils/types'
import HttpClient from '@utils/HttpClient'
import { HttpStatusCode } from 'axios'
import { HubConnection } from '@microsoft/signalr'
import { RootState } from '@redux/store'
import { useSelector } from 'react-redux'

const http = new HttpClient()

type SubtasksProps = {
  subtasks: SubtaskForBoard[]
  taskId: string
  hubConnection?: HubConnection
}

function Subtasks({ subtasks, taskId, hubConnection }: SubtasksProps) {
  const [_subtasks, setSubtasks] = useState<SubtaskForBoard[]>([])
  const projectId = useSelector((state: RootState) => state.project.activeProject.board.id)
  const accountId = useSelector((state: RootState) => state.login.accountInfo.id)
  useEffect(() => {
    setSubtasks(subtasks)
  }, [subtasks])
  useEffect(() => {
    if (hubConnection) {
      hubConnection.on(
        'ReceiveCheckSubtask',
        (assignmentId: string, taskid: string, subtaskId: number, status: boolean) => {
          if (taskId !== taskid) return
          const newSubtasks = [..._subtasks]
          const updatedSubtask = newSubtasks?.find(s => s.id === subtaskId)
          if (updatedSubtask) {
            updatedSubtask!.isCompleted = status
            setSubtasks(newSubtasks)
          }
        }
      )
      hubConnection.on(
        'ReceiveChangeSubtaskName',
        (assignmentId: string, taskid: string, subtaskId: number, updatedName: string) => {
          if (taskid !== taskId) return
          setSubtasks(prev => {
            const newSubtasks = [...prev]
            const updatedSubtask = newSubtasks.find(subtask => subtask.id === subtaskId)
            if (!updatedSubtask) return prev
            updatedSubtask.title = updatedName
            return newSubtasks
          })
        }
      )
      hubConnection.on(
        'ReceiveAddSubtaskResult',
        (assignmentId: string, taskid: string, subtasks: SubtaskForBoard[]) => {
          if (taskid !== taskId) return
          setSubtasks(prev => [...prev, ...subtasks])
        }
      )
      hubConnection.on('ReceiveDeleteSubtask', (assignmentId: string, taskid: string, subtaskId: number) => {
        if (taskid !== taskId) return
        setSubtasks(prev => prev.filter(subtask => subtask.id !== subtaskId))
      })
    }
  }, [hubConnection])

  const handleAddSubtasks = async (names: string[]) => {
    const res = await http.postAuth('/subtasks', { names, taskId })
    if (res?.status === HttpStatusCode.Ok) {
      const data = res?.data as SubtaskForBoard[]
      setSubtasks(prev => [...prev, ...data])
      if (hubConnection) {
        hubConnection.invoke('SendAddSubtaskResult', projectId, accountId, taskId, data)
      }
    }
  }
  const handleCheckSubtask = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id } = e.target
    const subtaskId = parseInt(id.split('-')[1]) // lấy subtask id

    const newSubtasks = [..._subtasks]
    const updatedSubtask = newSubtasks.find(subtask => subtask.id === subtaskId)

    if (!updatedSubtask) return

    const res = await http.putAuth(`/subtasks/${updatedSubtask?.id}/change-status`, { isCompleted: e.target.checked })
    if (res?.status === HttpStatusCode.Ok) {
      // update lại trạng thái subtask
      updatedSubtask!.isCompleted = res?.data
      setSubtasks(newSubtasks)
      if (hubConnection) {
        hubConnection.invoke('SendCheckSubtask', projectId, accountId, taskId, updatedSubtask?.id, Boolean(res?.data))
      }
    }
  }
  const handleDeleteSubtask = async (subtaskId: number) => {
    const res = await http.deleteAuth(`/subtasks/${subtaskId}`)
    if (res?.status === HttpStatusCode.Ok) {
      const data = res?.data as SubtaskResponse
      setSubtasks(prev => {
        const newSubtasks = prev.filter(subtask => subtask.id !== data.id)
        return newSubtasks
      })
      if (hubConnection) {
        hubConnection.invoke('SendDeleteSubtask', projectId, accountId, taskId, data.id)
      }
    }
  }
  const handleChangeSubtaskName = (sid: number, name: string) => {
    const newSubtasks = [...subtasks]
    const updatedSubtask = newSubtasks.find(subtask => subtask.id === sid)
    if (!updatedSubtask) return
    updatedSubtask.title = name
    setSubtasks(prev => newSubtasks)
    if (hubConnection) {
      hubConnection.invoke('SendChangeSubtaskName', projectId, accountId, taskId, updatedSubtask?.id, name)
    }
  }
  return (
    <>
      <div className='subtasks'>
        <p className='bold'>
          <i className='fa-solid fa-list-check'></i> Subtasks {_subtasks?.length > 0 ? `(${_subtasks?.length})` : ''}
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
          <AddSubtask taskId={taskId} hubConnection={hubConnection} onAddTask={handleAddSubtasks} />
        </div>
      </div>
    </>
  )
}

export default Subtasks
