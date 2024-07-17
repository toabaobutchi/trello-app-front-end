import Flex from '@comps/StyledComponents/Flex'
import Subtasks from './Subtasks'
import { useContext, useEffect, useState } from 'react'
import { AssignmentResponse, SubtaskForBoard, UpdatedTaskResponse } from '@utils/types'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@redux/store'
import UpdateTaskNameEditor from './UpdateTaskNameEditor'
import HttpClient from '@utils/HttpClient'
import { HttpStatusCode } from 'axios'
import UpdatePriorityEditor from './UpdatePriorityEditor'
import UpdateDueDateEditor from './UpdateDueDateEditor'
import UpdateDescriptionEditor from './UpdateDescriptionEditor'
import { useHub } from '@hooks/useHub'
import { TaskDetailContext } from '@pages/TaskDetailBoard/context'
import { hubs, ProjectHub } from '@utils/Hubs'
import { projectSlice } from '@redux/ProjectSlice'

const http = new HttpClient()

type RemoteUpdatingType = {
  assignmentId: string
  taskId: string
}

function TaskDetailInfo() {
  const context = useContext(TaskDetailContext)
  const taskDetail = context?.task
  const dispatch = useDispatch()
  const project = useSelector((state: RootState) => state.project.activeProject)
  const account = useSelector((state: RootState) => state.login.accountInfo)
  // const projectHub.connection = useHub('/dragHub', 'SendAddToDragGroup', project?.board?.id, account?.id)
  const [projectHub] = useState<ProjectHub>(new ProjectHub())
  const [remoteUpdating, setRemoteUpdating] = useState<RemoteUpdatingType>()
  const [creator] = useState<AssignmentResponse | undefined>(() =>
    project?.members.find(p => p.id === taskDetail?.creatorId)
  )
  useEffect(() => {
    if (projectHub.isConnected && taskDetail?.id) {
      // ReceiveUpdateTaskInfo
      projectHub.connection?.on(
        hubs.project.receive.updateTaskInfo,
        (_assignmentId: string, data: UpdatedTaskResponse) => {
          if (data && data.id === taskDetail?.id) {
            context?.setTask?.(
              prev =>
                ({
                  ...prev,
                  name: data?.name,
                  description: data?.description,
                  priority: data?.priority,
                  dueDate: data?.dueDate
                } as typeof prev)
            )
            setRemoteUpdating(_prev => undefined)
          }
        }
      )
      // ReceiveStartUpdateTaskInfo
      projectHub.connection?.on(hubs.project.receive.startUpdateTaskInfo, (assignmentId: string, taskId: string) => {
        if (taskId && taskId === taskDetail?.id) setRemoteUpdating(_prev => ({ assignmentId, taskId }))
      })

      // ReceiveCancelUpdateTaskInfo
      projectHub.connection?.on(hubs.project.receive.cancelUpdateTaskInfo, (_assignmentId: string, taskId: string) => {
        if (taskId && taskId === taskDetail?.id) setRemoteUpdating(_prev => undefined)
      })
    }
  }, [projectHub, taskDetail?.id, context])
  // lấy thông tin creator

  const handleSendMessageToDragHub = (data: UpdatedTaskResponse) => {
    dispatch(projectSlice.actions.updateTaskInfo(data)) // cập nhật cho giao diện cá nhân
    if (projectHub.connection && project?.board?.id && data && account?.id) {
      // SendUpdateTaskInfo
      projectHub.connection.invoke(hubs.project.send.updateTaskInfo, data)
    }
  }
  const handleUpdateName = async (name: string) => {
    const res = await http.putAuth(`/tasks/${taskDetail?.id}`, { name })
    if (res?.status === HttpStatusCode.Ok) {
      const data = res?.data as UpdatedTaskResponse
      context?.setTask?.(prev => ({ ...prev, name: data?.name } as typeof prev))
      handleSendMessageToDragHub(data)
    }
  }
  const handleUpdatePriority = async (priority: string) => {
    const res = await http.putAuth(`/tasks/${taskDetail?.id}`, { priority })
    if (res?.status === HttpStatusCode.Ok) {
      const data = res?.data as UpdatedTaskResponse
      context?.setTask?.(prev => ({ ...prev, priority: data?.priority } as typeof prev))
      handleSendMessageToDragHub(data)
    }
  }
  const handleUpdateDueDate = async (dueDate: Date) => {
    const res = await http.putAuth(`/tasks/${taskDetail?.id}`, { dueDate: dueDate.getTime() / 1000 })
    if (res?.status === HttpStatusCode.Ok) {
      if (res?.status === HttpStatusCode.ResetContent) {
        console.log('Task due date is larger than project due date')
      } else {
        const data = res?.data as UpdatedTaskResponse
        context?.setTask?.(prev => ({ ...prev, dueDate: data?.dueDate } as typeof prev))
        handleSendMessageToDragHub(data)
      }
    }
  }
  const handleUpdateDescription = async (description: string) => {
    const res = await http.putAuth(`/tasks/${taskDetail?.id}`, { description })
    if (res?.status === HttpStatusCode.Ok) {
      const data = res?.data as UpdatedTaskResponse
      context?.setTask?.(prev => ({ ...prev, description: res?.data?.description } as typeof prev))
      handleSendMessageToDragHub(data)
    }
  }
  const updator = remoteUpdating && project.members?.find(m => m.id === remoteUpdating?.assignmentId)
  return (
    <>
      <div
        className={`task-details-basic-info${remoteUpdating ? ' remote-updating' : ''}`}
        data-update={`${updator?.email} is updating`}
      >
        <UpdateTaskNameEditor
          hubConnection={projectHub.connection}
          task={taskDetail}
          onUpdateTaskName={handleUpdateName}
        />
        <Flex $alignItem='center' $gap='1.5rem' className='task-details-basic-info-item'>
          <p className='bold'>
            <i className='fa-solid fa-user-pen'></i> Created by:
          </p>
          <Flex $alignItem='center' $gap='0.25rem' className='task-details-basic-info-item-creator'>
            <img className='task-details-creator-avatar' src={creator?.avatar} />{' '}
            <span style={{ fontSize: '1rem' }}>
              {creator?.email} ({creator?.displayName})
            </span>
          </Flex>
        </Flex>
        <Flex $alignItem='center' $gap='1.5rem' className='task-details-basic-info-item'>
          <p className='bold'>
            <i className='fa-solid fa-table-columns'></i> Status (List):
          </p>
          <p>{taskDetail?.listName}</p>
        </Flex>
        <Flex $alignItem='center' $gap='1.5rem' className='task-details-basic-info-item'>
          <p className='bold'>
            <i className='fa-solid fa-tag'></i> Priority:
          </p>
          <UpdatePriorityEditor
            hubConnection={projectHub.connection}
            taskId={taskDetail?.id}
            onUpdate={handleUpdatePriority}
            priority={taskDetail?.priority}
          />
        </Flex>
        <Flex $alignItem='center' $gap='1.5rem' className='task-details-basic-info-item'>
          <p className='bold'>
            <i className='fa-regular fa-clock'></i> Due date:
          </p>
          <UpdateDueDateEditor dueDate={taskDetail?.dueDate} onUpdate={handleUpdateDueDate} />
        </Flex>
        <Flex $alignItem='center' $gap='1.5rem' className='task-details-basic-info-item'>
          <p className='bold'>
            <i className='fa-solid fa-scroll'></i> Description
          </p>
          <UpdateDescriptionEditor
            hubConnection={projectHub.connection}
            task={taskDetail}
            onUpdate={handleUpdateDescription}
          />
        </Flex>
        <Subtasks
          hubConnection={projectHub.connection}
          subtasks={taskDetail?.subTasks as SubtaskForBoard[]}
          taskId={taskDetail?.id ?? ''}
        />
      </div>
    </>
  )
}

export default TaskDetailInfo
