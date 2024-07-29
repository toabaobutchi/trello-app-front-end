import Flex from '@comps/StyledComponents/Flex'
import Subtasks from './Subtasks'
import { useContext, useEffect, useState } from 'react'
import {
  AssignByTaskResponse,
  AssignmentResponse,
  SubtaskForBoard,
  TaskDetailForBoard,
  UpdatedTaskResponse
} from '@utils/types'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@redux/store'
import UpdateTaskNameEditor from './UpdateTaskNameEditor'
import { HttpStatusCode } from 'axios'
import UpdatePriorityEditor from './UpdatePriorityEditor'
import UpdateDueDateEditor from './UpdateDueDateEditor'
import UpdateDescriptionEditor from './UpdateDescriptionEditor'
import { TaskDetailContext } from '@pages/TaskDetailBoard/context'
import { hubs, ProjectHub } from '@utils/Hubs'
import { projectSlice } from '@redux/ProjectSlice'
import { updateTask } from '@services/task.services'

type RemoteUpdatingType = {
  assignmentId: string
  taskId: string
}

function TaskDetailInfo() {
  const context = useContext(TaskDetailContext)
  const taskDetail = context?.task
  const dispatch = useDispatch()
  const project = useSelector((state: RootState) => state.project.activeProject)
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

      projectHub.connection?.on(
        hubs.project.receive.assignMemberToTask,
        (_assignmentId: string, data: AssignByTaskResponse) => {
          if (taskDetail.id === data.taskId) {
            context?.setTask?.(
              prev =>
                ({ ...prev, taskAssignmentIds: prev?.taskAssignmentIds?.concat(data.assignmentIds) } as typeof prev)
            )
          }
        }
      )
    }
  }, [projectHub, taskDetail?.id, context])
  // lấy thông tin creator

  const handleSendMessageToDragHub = (data: UpdatedTaskResponse) => {
    dispatch(projectSlice.actions.updateTaskInfo(data)) // cập nhật cho giao diện cá nhân
    if (projectHub.isConnected && data) {
      // SendUpdateTaskInfo
      projectHub.connection?.invoke(hubs.project.send.updateTaskInfo, data)
    }
  }
  const updateTaskContext = (
    updateKey: keyof TaskDetailForBoard,
    updatedDataKey: keyof UpdatedTaskResponse,
    data: UpdatedTaskResponse
  ) => {
    context?.setTask?.(prev => ({ ...prev, [updateKey]: data?.[updatedDataKey] } as typeof prev))
  }
  const handleUpdateName = async (name: string) => {
    if (taskDetail?.id) {
      const res = await updateTask(taskDetail.id, { name })
      if (res?.isSuccess) {
        const data = res.data
        updateTaskContext('name', 'name', data)
        handleSendMessageToDragHub(data)
      }
    }
  }
  const handleUpdatePriority = async (priority: string) => {
    if (taskDetail?.id) {
      const res = await updateTask(taskDetail.id, { priority })
      if (res?.isSuccess) {
        const data = res.data
        updateTaskContext('priority', 'priority', data)
        handleSendMessageToDragHub(data)
      }
    }
  }
  const handleUpdateDueDate = async (dueDate: Date) => {
    if (taskDetail?.id) {
      const res = await updateTask(taskDetail.id, { dueDate: dueDate.getTime() / 1000 })
      if (res?.isSuccess) {
        if (res?.status === HttpStatusCode.ResetContent) {
          console.log('Task due date is larger than project due date')
        } else {
          const data = res.data
          updateTaskContext('dueDate', 'dueDate', data)
          handleSendMessageToDragHub(data)
        }
      }
    }
  }
  const handleUpdateDescription = async (description: string) => {
    if (taskDetail?.id) {
      const res = await updateTask(taskDetail.id, { description })
      if (res?.isSuccess) {
        const data = res.data
        updateTaskContext('description', 'description', data)
        handleSendMessageToDragHub(data)
      }
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