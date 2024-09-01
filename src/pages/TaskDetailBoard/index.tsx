import { useProjectDispatch, useProjectHub, useProjectSelector } from '@hooks/index'
import LoadingLayout from '@layouts/LoadingLayout'
import TaskDetail from '@pages/TaskDetailBoard/TaskDetail'
import { getTaskDetail, joinTask, markTask } from '@services/task.services'
import { hubs } from '@utils/Hubs'
import { TaskDetailForBoard } from '@utils/types/task.type'
import { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { TaskDetailContext } from './context'
import TaskDetailHeaderToolBar from './TaskDetailHeaderToolBar'
import { BaseCustomModal } from '@comps/Modal/Custom'

function TaskDetailBoard() {
  const [taskDetail, setTaskDetail] = useState<TaskDetailForBoard>()
  const { members } = useProjectSelector()
  const dispatch = useProjectDispatch()
  const navigate = useNavigate()
  const { taskId } = useParams()
  const projectHub = useProjectHub()

  useEffect(() => {
    if (taskId) {
      getTaskDetail(taskId).then(res => {
        if (res?.isSuccess) {
          setTaskDetail(res?.data)
        } else console.log('Fail: ', res?.message)
      })
    }
  }, [taskId])

  const timeOutId = useRef<number>()
  const handleMarkNeedHelp = async (e: React.ChangeEvent<HTMLInputElement>) => {
    // xoá đi vòng lặp cũ
    if (timeOutId.current) {
      clearTimeout(timeOutId.current)
    }
    timeOutId.current = setTimeout(async () => {
      if (taskId) {
        const res = await markTask(taskId, { isMarkedNeedHelp: e.target.checked })
        if (res?.isSuccess) {
          const data = res.data
          setTaskDetail(
            prev =>
              ({
                ...prev,
                isMarkedNeedHelp: data?.isMarkedNeedHelp
              } as TaskDetailForBoard)
          )
          // dispatch to store
          dispatch.markTask(data)
          if (projectHub.isConnected) {
            projectHub.connection?.invoke(hubs.project.send.markTask, data).catch(_ => {})
          }
        }
      }
    }, 500)
  }
  const handleCloseTaskDetailModal = () => {
    navigate(-1)
  }
  const handleMarkCompleteTask = async () => {
    if (taskId) {
      const res = await markTask(taskId, { isCompleted: true })
      if (res?.isSuccess) {
        const data = res.data
        setTaskDetail(
          prev =>
            ({
              ...prev,
              isCompleted: data?.isCompleted
            } as TaskDetailForBoard)
        )
        dispatch.markTask(data)
        if (projectHub.isConnected) {
          projectHub.connection?.invoke(hubs.project.send.markTask, data).catch(_ => {})
        }
      }
    }
  }
  const handleReOpenTask = async () => {
    if (taskId) {
      const res = await markTask(taskId, { isReOpened: true })
      if (res?.isSuccess) {
        const data = res.data
        setTaskDetail(
          prev =>
            ({
              ...prev,
              isReOpened: data?.isReOpened,
              isCompleted: data?.isCompleted
            } as TaskDetailForBoard)
        )

        dispatch.markTask(data)

        if (projectHub.isConnected) {
          projectHub.connection?.invoke(hubs.project.send.markTask, data).catch(_ => {})
        }
      }
    }
  }
  const handleJoinTask = async () => {
    if (taskId) {
      const res = await joinTask(taskId)
      if (res?.isSuccess) {
        // setIsJoined(true)
        const data = res.data
        dispatch.joinTask(data)

        // set task assignments
        const newAssignment = members.find(m => m.id === data.assignmentId)?.id
        const newTaskAssignments = [...(taskDetail?.taskAssignmentIds ?? [])]
        if (newAssignment) {
          newTaskAssignments.push(newAssignment)
        }
        setTaskDetail(
          prev =>
            ({
              ...prev,
              taskAssignmentIds: newTaskAssignments
            } as TaskDetailForBoard)
        )

        // call to hub
        if (projectHub.isConnected) {
          // SendJoinTask
          projectHub.connection?.send(hubs.project.send.joinTask, data)
        }
      }
    }
  }
  return (
    <>
      <TaskDetailContext.Provider value={{ task: taskDetail, setTask: setTaskDetail }}>
        <BaseCustomModal
          className='task-detail-modal'
          title={
            <TaskDetailHeaderToolBar
              taskDetail={taskDetail}
              onMarkCompleteTask={handleMarkCompleteTask}
              onMarkNeedHelp={handleMarkNeedHelp}
              onReOpenTask={handleReOpenTask}
              onJoinTask={handleJoinTask}
            />
          }
          open
          onClose={handleCloseTaskDetailModal}
        >
          <LoadingLayout className='row jcc w-full h-full' isLoading={!taskDetail}>
            <TaskDetail />
          </LoadingLayout>
        </BaseCustomModal>
      </TaskDetailContext.Provider>
    </>
  )
}

export default TaskDetailBoard
