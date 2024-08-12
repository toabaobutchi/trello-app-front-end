import Button from '@comps/Button'
import Modal from '@comps/Modal'
import Flex from '@comps/StyledComponents/Flex'
import SwitchButton from '@comps/SwitchButton'
import TaskDetail from '@pages/TaskDetailBoard/TaskDetail'
import DuplicateTask from '@pages/TaskDetailBoard/TaskDetail/DuplicateTask'
import { TaskDetailForBoard } from '@utils/types'
import { HttpStatusCode } from 'axios'
import { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { TaskDetailContext } from './context'
import { useProjectSelector } from '@hooks/useProjectSelector'
import { useDispatch } from 'react-redux'
import { projectSlice } from '@redux/ProjectSlice'
import { useModal } from '@hooks/useModal'
import AssignMember from '@pages/TaskDetailBoard/TaskDetail/AssignMember'
import LoadingLayout from '@layouts/LoadingLayout'
import { hubs, ProjectHub } from '@utils/Hubs'
import { getTaskDetail, joinTask, markTask } from '@services/task.services'
import { isAdminOrOwner } from '@utils/functions'

function TaskDetailBoard() {
  const [taskDetail, setTaskDetail] = useState<TaskDetailForBoard>()
  const [duplicateTaskModal, setDuplicateTaskModal] = useState(false)
  const { members, board } = useProjectSelector()
  const dispatch = useDispatch()
  const [isJoined, setIsJoined] = useState(false)
  const navigate = useNavigate()
  const [joinModal, setJoinModal] = useState(false)
  const [assignModal, handleToggleAssignModal] = useModal()
  const { taskId } = useParams()
  const [projectHub] = useState(new ProjectHub())

  useEffect(() => {
    if (taskDetail?.id) {
      const member = members.find(m => m.id === board?.assignmentId)
      if (!member) setIsJoined(false)
      else setIsJoined(taskDetail?.taskAssignmentIds?.includes(member.id) ?? false)
    }
  }, [taskDetail?.id, members, taskDetail?.taskAssignmentIds, board?.assignmentId])

  useEffect(() => {
    if (taskId) {
      getTaskDetail(taskId).then(res => {
        if (res?.status === HttpStatusCode.Ok) {
          setTaskDetail(res?.data)
        } else console.log('Fail: ', res?.message)
      })
    }
  }, [taskId])

  const handleToggleDuplicateTaskModal = () => {
    setDuplicateTaskModal(!duplicateTaskModal)
  }
  const handleToggleJoinModal = () => {
    setJoinModal(!joinModal)
  }
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
          dispatch(projectSlice.actions.markTask(data))
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
        dispatch(projectSlice.actions.markTask(data))
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

        dispatch(projectSlice.actions.markTask(data))

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
        handleToggleJoinModal()
        setIsJoined(true)
        const data = res.data
        dispatch(projectSlice.actions.joinTask(data))

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
  const isAdminorOwner = isAdminOrOwner(board.context)
  return (
    <>
      <TaskDetailContext.Provider value={{ task: taskDetail, setTask: setTaskDetail }}>
        <Modal
          className='task-detail-modal'
          // style={{ width: '80%' }}
          layout={{
            header: {
              closeIcon: true,
              title: (
                <>
                  <Flex $alignItem='center' $gap='1rem'>
                    {isAdminorOwner && (
                      <Button onClick={handleToggleDuplicateTaskModal} variant='text' theme='default'>
                        <i className='fa-regular fa-clone'></i> Duplicate
                      </Button>
                    )}
                    {!isJoined && (
                      <Button onClick={handleToggleJoinModal} variant='text' theme='default'>
                        <i className='fa-solid fa-right-to-bracket'></i> Join
                      </Button>
                    )}
                    {isAdminorOwner && (
                      <Button onClick={handleToggleAssignModal} variant='text' theme='default'>
                        <i className='fa-solid fa-user-plus'></i> Assign
                      </Button>
                    )}
                    {taskDetail?.id && (
                      <Flex $alignItem='center' $gap='0.5rem'>
                        <SwitchButton
                          inputAttributes={{
                            id: 'need-help-toggle',
                            type: 'checkbox',
                            name: 'need-help-toggle',
                            checked: Boolean(taskDetail?.isMarkedNeedHelp)
                          }}
                          onChange={handleMarkNeedHelp}
                        />
                        <label
                          className={taskDetail?.isMarkedNeedHelp ? 'text-success' : 'text-secondary'}
                          style={{ fontSize: '1rem' }}
                          htmlFor='need-help-toggle'
                        >
                          Need help!
                        </label>
                      </Flex>
                    )}
                    {!taskDetail?.isCompleted ? (
                      <Button onClick={handleMarkCompleteTask} variant='text' theme='default'>
                        <i className='fa-solid fa-check'></i> Mark as completed
                      </Button>
                    ) : (
                      <>
                        <Button variant='text' theme='success'>
                          Completed <i className='fa-solid fa-check'></i>
                        </Button>
                      </>
                    )}
                    {taskDetail?.isCompleted && isAdminorOwner && (
                      <>
                        <Button onClick={handleReOpenTask} variant='text' theme='warning'>
                          <i className='fa-solid fa-arrow-rotate-left'></i> Re-open
                        </Button>
                      </>
                    )}
                  </Flex>
                </>
              )
            }
          }}
          open
          onClose={handleCloseTaskDetailModal}
        >
          <LoadingLayout className='row jcc w-full h-full' isLoading={!taskDetail}>
            <TaskDetail />
          </LoadingLayout>
        </Modal>

        {/* duplicate modal */}
        <Modal
          layout={{ header: { title: 'Duplicate task', closeIcon: true } }}
          style={{ width: '30%' }}
          open={duplicateTaskModal}
          onClose={handleToggleDuplicateTaskModal}
        >
          <DuplicateTask task={taskDetail} onCloseModal={handleToggleDuplicateTaskModal} />
        </Modal>

        {/* join modal */}
        <Modal
          style={{ width: '30%' }}
          layout={{
            header: {
              title: 'Join task',
              closeIcon: true
            },
            footer: (
              <>
                <Flex $alignItem='center' $gap='1rem'>
                  <Button onClick={handleToggleJoinModal} variant='filled' theme='danger'>
                    Cancel
                  </Button>
                  <Button onClick={handleJoinTask} variant='filled' theme='primary'>
                    Join
                  </Button>
                </Flex>
              </>
            )
          }}
          open={joinModal}
          onClose={handleToggleJoinModal}
        >
          Join task <span className='text-primary fw-bold'>{taskDetail?.name}</span>
        </Modal>

        {/* assign modal */}
        <Modal
          open={assignModal}
          layout={{ header: { closeIcon: true, title: 'Assign to new members' } }}
          onClose={handleToggleAssignModal}
          style={{ width: '30%' }}
        >
          {taskDetail && <AssignMember task={taskDetail} onCloseModal={handleToggleAssignModal} />}
        </Modal>
      </TaskDetailContext.Provider>
    </>
  )
}

export default TaskDetailBoard
