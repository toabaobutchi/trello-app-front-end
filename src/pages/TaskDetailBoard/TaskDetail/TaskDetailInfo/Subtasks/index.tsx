import './Subtasks.scss'
import { useContext, useEffect, useState } from 'react'
import AddSubtask from './AddSubtask'
import SubtaskItem from './SubtaskItem'
import {
  AssignByTaskResponse,
  AssignSubtaskResponse,
  JoinSubtaskResponse,
  SubtaskForBoard,
  UnassignSubtaskResponse
} from '@utils/types'
import { HubConnection } from '@microsoft/signalr'
import { hubs } from '@utils/Hubs'
import { useDispatch } from 'react-redux'
import { projectSlice } from '@redux/ProjectSlice'
import { addSubtasks, checkSubtask, deleteSubtask } from '@services/subtask.services'
import { TaskDetailContext } from '@pages/TaskDetailBoard/context'

type SubtasksProps = {
  subtasks: SubtaskForBoard[]
  taskId: string
  hubConnection?: HubConnection
}

function Subtasks({ subtasks, taskId, hubConnection }: SubtasksProps) {
  const [_subtasks, setSubtasks] = useState<SubtaskForBoard[]>([])
  const dispatch = useDispatch()
  const context = useContext(TaskDetailContext)

  useEffect(() => {
    setSubtasks(subtasks)
  }, [subtasks])
  
  useEffect(() => {
    if (hubConnection) {
      // ReceiveCheckSubtask
      hubConnection.on(
        hubs.project.receive.checkSubtask,
        (_assignmentId: string, taskid: string, subtaskId: number, status: boolean) => {
          if (taskId !== taskid) return
          setSubtasks(prev => {
            const newSubtasks = [...prev]
            const updatedSubtask = newSubtasks.find(subtask => subtask.id === subtaskId)
            if (!updatedSubtask) return prev
            updatedSubtask.isCompleted = status
            return newSubtasks
          })
        }
      )
      // ReceiveChangeSubtaskName
      hubConnection.on(
        hubs.project.receive.changeSubtaskName,
        (_assignmentId: string, taskid: string, subtaskId: number, updatedName: string) => {
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
      // ReceiveAddSubtaskResult
      hubConnection.on(
        hubs.project.receive.addSubtaskResult,
        (_assignmentId: string, taskid: string, subtasks: SubtaskForBoard[]) => {
          if (taskid !== taskId) return
          setSubtasks(prev => [...prev, ...subtasks])
        }
      )
      // ReceiveDeleteSubtask
      hubConnection.on(
        hubs.project.receive.deleteSubtask,
        (_assignmentId: string, taskid: string, subtaskId: number) => {
          if (taskid !== taskId) return
          setSubtasks(prev => prev.filter(subtask => subtask.id !== subtaskId))
        }
      )
      const handleChangeSubtaskUI = (data: JoinSubtaskResponse | AssignSubtaskResponse) => {
        if (data.taskId === taskId) {
          // cập nhật lại context bên ngoài - tự động cập nhật lại bên trong
          context?.setTask?.(prev => {
            const taskDetail = { ...prev } as typeof prev
            const joinedSubtask = taskDetail?.subTasks?.find(s => s.id === data.id)
            if (joinedSubtask) {
              joinedSubtask.assignmentId = data.assignmentId
              return taskDetail
            } else {
              return prev
            }
          })
        }
      }
      hubConnection.on(hubs.project.receive.joinSubtask, (_assignmentId: string, data: JoinSubtaskResponse) => {
        handleChangeSubtaskUI(data)
      })
      hubConnection.on(hubs.project.receive.assignSubtask, (_assignmentId: string, data: AssignSubtaskResponse) => {
        if (data.isNewAssignment) {
          // thêm thành viên mới vào task - thay đổi context
          context?.setTask?.(prev => {
            const taskDetail = { ...prev } as typeof prev
            taskDetail?.taskAssignmentIds?.push(data.assignmentId)
            return taskDetail
          })

          // thay đổi store bên ngoài - dispatch
          const payload: AssignByTaskResponse = {
            assignerId: data.assignerId ?? '',
            assignmentIds: [data.assignmentId],
            taskId: data.taskId
          }
          dispatch(projectSlice.actions.addAssignmentToTask(payload))
        }

        // cập nhật lại context bên ngoài - tự động cập nhật lại bên trong
        handleChangeSubtaskUI(data)
      })

      hubConnection.on(hubs.project.receive.unassignSubtask, (_assignmentId: string, data: UnassignSubtaskResponse) => {
        if (data.taskId === taskId) {
          context?.setTask?.(prev => {
            const taskDetail = { ...prev } as typeof prev
            const unassignedSubtask = taskDetail?.subTasks?.find(s => s.id === data.subtaskId)
            if (unassignedSubtask) {
              unassignedSubtask.assignmentId = undefined
              return taskDetail
            } else {
              return prev
            }
          })
        }
      })
    }
  }, [hubConnection, taskId])

  const handleAddSubtasks = async (names: string[]) => {
    const res = await addSubtasks({ taskId, names })
    if (res?.isSuccess) {
      const data = res.data
      setSubtasks(prev => [...prev, ...data])
      if (hubConnection) {
        // SendAddSubtaskResult
        hubConnection.invoke(hubs.project.send.addSubtaskResult, taskId, data)
      }
      dispatch(projectSlice.actions.changeSubtaskCount({ taskId, subtaskCount: data.length }))
    }
  }
  const handleCheckSubtask = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id } = e.target
    const subtaskId = parseInt(id.split('-')[1]) // lấy subtask id

    const newSubtasks = [..._subtasks]
    const updatedSubtask = newSubtasks.find(subtask => subtask.id === subtaskId)

    if (!updatedSubtask) return

    const res = await checkSubtask(updatedSubtask.id, e.target.checked)
    if (res?.isSuccess) {
      // update lại trạng thái subtask
      updatedSubtask.isCompleted = res.data
      setSubtasks(_prev => newSubtasks)
      if (hubConnection) {
        // SendCheckSubtask
        hubConnection.invoke(hubs.project.send.checkSubtask, taskId, updatedSubtask?.id, Boolean(res.data))
      }
      dispatch(projectSlice.actions.changeSubtaskStatus({ taskId, status: Boolean(res?.data) }))
    }
  }
  const handleDeleteSubtask = async (subtaskId: number) => {
    const res = await deleteSubtask(subtaskId)
    if (res?.isSuccess) {
      const data = res.data
      setSubtasks(prev => {
        const newSubtasks = prev.filter(subtask => subtask.id !== data.id)
        return newSubtasks
      })
      if (hubConnection) {
        // SendDeleteSubtask
        hubConnection.invoke(hubs.project.send.deleteSubtask, taskId, data.id)
      }
      dispatch(projectSlice.actions.changeSubtaskCount({ taskId, subtaskCount: -1 }))
    }
  }
  const handleChangeSubtaskName = (sid: number, name: string) => {
    const newSubtasks = [...subtasks]
    const updatedSubtask = newSubtasks.find(subtask => subtask.id === sid)
    if (!updatedSubtask) return
    updatedSubtask.title = name
    setSubtasks(_prev => newSubtasks)
    if (hubConnection) {
      // SendChangeSubtaskName
      hubConnection.invoke(hubs.project.send.changeSubtaskName, taskId, updatedSubtask?.id, name).catch(_ => {})
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
