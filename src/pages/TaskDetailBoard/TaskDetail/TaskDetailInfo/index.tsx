import Flex from '@comps/StyledComponents/Flex'
import Subtasks from './Subtasks'
import { useContext, useEffect, useRef, useState } from 'react'
import {
  AssignByTaskResponse,
  AssignmentResponse,
  ChangeTaskOrderResponse,
  DeletedTaskAssignmentResponse,
  DeletedTaskResponse,
  DragOverResult,
  JoinTaskResponse,
  ResetTaskModel,
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
import { resetTask, updateTask } from '@services/task.services'
import UpdateStartDateEditor from './UpdateStartDateEditor'
import Modal from '@comps/Modal'
import { useModal } from '@hooks/useModal'
import { useNavigate } from 'react-router-dom'
import Button from '@comps/Button'
import toast from '@comps/Toast/toast'
import config from '@confs/app.config'

type RemoteUpdatingType = {
  assignmentId: string
  taskId: string
}

function TaskDetailInfo() {
  const context = useContext(TaskDetailContext)
  const taskDetail = context?.task
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const project = useSelector((state: RootState) => state.project.activeProject)
  const [projectHub] = useState<ProjectHub>(new ProjectHub())
  const [remoteUpdating, setRemoteUpdating] = useState<RemoteUpdatingType>()
  const [remoteDeleteModal, handleToggleRemoteDeleteModal, setRemoteDeleteModal] = useModal()
  const remoteUpdateTimeoutId = useRef<number>()
  const [creator] = useState<AssignmentResponse | undefined>(() =>
    project?.members.find(p => p.id === taskDetail?.creatorId)
  )
  const [remoteDeleteType, setRemoteDeleteType] = useState<boolean>()

  const handleCloseRemoteDeleteModal = () => {
    setRemoteDeleteModal(false)
    navigate(-1)
  }

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
                  dueDate: data?.dueDate,
                  startedAt: data?.startedAt
                } as typeof prev)
            )
            setRemoteUpdating(_prev => undefined)
          }
        }
      )
      // ReceiveStartUpdateTaskInfo
      projectHub.connection?.on(hubs.project.receive.startUpdateTaskInfo, (assignmentId: string, taskId: string) => {
        if (taskId && taskId === taskDetail?.id) {
          setRemoteUpdating(_ => ({ assignmentId, taskId }))

          if (remoteUpdateTimeoutId.current) {
            clearTimeout(remoteUpdateTimeoutId.current)
            remoteUpdateTimeoutId.current = undefined
          }

          // sau x giây thì giải phóng người dùng
          remoteUpdateTimeoutId.current = setTimeout(() => {
            setRemoteUpdating(_ => undefined)
            remoteUpdateTimeoutId.current = undefined
          }, config.timeOut.drag)
        }
      })
      // ReceiveCancelUpdateTaskInfo
      projectHub.connection?.on(hubs.project.receive.cancelUpdateTaskInfo, (_assignmentId: string, taskId: string) => {
        if (taskId && taskId === taskDetail?.id) {
          setRemoteUpdating(_ => undefined)
          if (remoteUpdateTimeoutId.current) {
            clearTimeout(remoteUpdateTimeoutId.current)
            remoteUpdateTimeoutId.current = undefined
          }
        }
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
      projectHub.connection?.on(hubs.project.receive.joinTask, (_assignmentId: string, data: JoinTaskResponse) => {
        // dispatch(projectSlice.actions.joinTask(data))
        if (data.taskId === taskDetail.id) {
          context?.setTask?.(
            prev =>
              ({ ...prev, taskAssignmentIds: prev?.taskAssignmentIds?.concat([data.assignmentId]) } as typeof prev)
          )
        }
      })
      projectHub.connection?.on(
        hubs.project.receive.unassignTaskAssignment,
        (_assignmentId: string, data: DeletedTaskAssignmentResponse) => {
          if (data.taskId === taskDetail.id) {
            context?.setTask?.(
              prev =>
                ({
                  ...prev,
                  taskAssignmentIds: prev?.taskAssignmentIds?.filter(id => id !== data.taskId)
                } as typeof prev)
            )
          }
        }
      )
      projectHub.connection?.on(
        hubs.project.receive.deleteTask,
        (_assignmentId: string, _taskId: string, data: DeletedTaskResponse, moveToTrash: boolean) => {
          if (data.id === taskDetail.id) {
            handleToggleRemoteDeleteModal()
            setRemoteDeleteType(moveToTrash)
          }
        }
      )
      projectHub.connection?.on(
        hubs.project.receive.endDragTask,
        (_assignmentId: string, res: ChangeTaskOrderResponse, dragResult: DragOverResult) => {
          console.log('endDragTask')
          if (context?.task?.id && res.updatedNewTaskOrder.includes(context?.task?.id)) {
            context?.setTask?.(
              prev =>
                ({
                  ...prev,
                  listId: dragResult?.overList?.id,
                  listName: dragResult?.overList?.name
                } as typeof prev)
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
  const handleUpdateDueDate = async (dueDate: number) => {
    if (taskDetail?.id) {
      const res = await updateTask(taskDetail.id, { dueDate })
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
  const handleUpdateStartDate = async (startDate: number) => {
    if (taskDetail?.id) {
      const res = await updateTask(taskDetail.id, { startedAt: startDate })
      if (res?.isSuccess) {
        if (res?.status === HttpStatusCode.ResetContent) {
          toast.error('Task due date is larger than project due date', '')
        } else {
          const data = res.data
          updateTaskContext('startedAt', 'startedAt', data)
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
  const handleReset = async (model: ResetTaskModel) => {
    if (taskDetail?.id) {
      const res = await resetTask(taskDetail.id, model)
      if (res?.isSuccess) {
        const data = res.data
        let key
        if (model.resetPriority) key = 'priority'
        else if (model.resetDueDate) key = 'dueDate'
        else if (model.resetStartDate) key = 'startedAt'
        else key = 'description'
        updateTaskContext(key as keyof TaskDetailForBoard, key as keyof UpdatedTaskResponse, data)
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
        <Flex $alignItem='center' className='task-details-basic-info-item'>
          <p className='bold task-details-basic-info-item-label'>
            <i className='fa-solid fa-user-pen'></i> Created by:
          </p>
          <Flex $alignItem='center' $gap='0.25rem' className='task-details-basic-info-item-creator'>
            <img className='task-details-creator-avatar' src={creator?.avatar} />{' '}
            <span style={{ fontSize: '1rem' }}>
              {creator?.email} ({creator?.displayName})
            </span>
          </Flex>
        </Flex>
        <Flex $alignItem='center' className='task-details-basic-info-item'>
          <p className='bold task-details-basic-info-item-label'>
            <i className='fa-solid fa-table-columns'></i> Status (List):
          </p>
          <p>{taskDetail?.listName}</p>
        </Flex>
        <Flex $alignItem='center' className='task-details-basic-info-item'>
          <p className='bold task-details-basic-info-item-label'>
            <i className='fa-solid fa-tag'></i> Priority:
          </p>
          <UpdatePriorityEditor
            hubConnection={projectHub.connection}
            taskId={taskDetail?.id}
            onUpdate={handleUpdatePriority}
            priority={taskDetail?.priority}
            onClear={handleReset}
          />
        </Flex>
        <Flex $alignItem='center' className='task-details-basic-info-item'>
          <p className='bold task-details-basic-info-item-label'>
            <i className='fa-regular fa-clock'></i> Start at:
          </p>
          <UpdateStartDateEditor
            startDate={taskDetail?.startedAt}
            onUpdate={handleUpdateStartDate}
            onClear={handleReset}
          />
        </Flex>
        <Flex $alignItem='center' className='task-details-basic-info-item'>
          <p className='bold task-details-basic-info-item-label'>
            <i className='fa-regular fa-clock'></i> Due date:
          </p>
          <UpdateDueDateEditor dueDate={taskDetail?.dueDate} onUpdate={handleUpdateDueDate} onClear={handleReset} />
        </Flex>
        <Flex className='task-details-basic-info-item'>
          <p className='bold task-details-basic-info-item-label'>
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
      <Modal
        layout={{
          header: { title: 'Warning', closeIcon: true },
          footer: (
            <>
              <Button onClick={handleCloseRemoteDeleteModal} variant='filled'>
                Exit
              </Button>
            </>
          )
        }}
        open={remoteDeleteModal}
        onClose={handleCloseRemoteDeleteModal}
      >
        <p className='mb-1 text-danger'>
          The task <b>{taskDetail?.name}</b> was{' '}
          {remoteDeleteType
            ? 'moved to trash. Go to recycle bin and you can find and restore it!'
            : 'deleted permanently!'}
        </p>
        <p>Close this dialog to exit!</p>
      </Modal>
    </>
  )
}

export default TaskDetailInfo
