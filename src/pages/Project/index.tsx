import './Project.scss'
import Flex from '@comps/StyledComponents/Flex'
import ProjectHeader from './partials/ProjectHeader'
import {
  AssignByTaskResponse,
  AssignSubtaskResponse,
  ChangeTaskOrderResponse,
  CreateListResponse,
  CreateTaskResponse,
  DeletedAssignmentResponse,
  DeletedRelationshipResponse,
  DeletedTaskAssignmentResponse,
  DeletedTaskResponse,
  DispatchRelatedTaskResponse,
  DragOverResult,
  JoinTaskResponse,
  MarkedTaskResponse,
  ProjectPageParams,
  ProjectResponseForBoard,
  RelatedTaskResponse,
  RemoteDraggingType,
  SubtaskForBoard,
  TaskResponseForBoard,
  UpdatedListResponse,
  UpdatedTaskResponse
} from '@utils/types'
import { Suspense, useEffect, useRef, useState } from 'react'
import { NavLink, Outlet, useLoaderData, useNavigate, useParams } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { projectSlice } from '@redux/ProjectSlice'
import LoadingLayout from '@layouts/LoadingLayout'
import { hubs, ProjectHub } from '@utils/Hubs'
import { useProjectSelector } from '@hooks/useProjectSelector'
import ProjectSideBar from './partials/ProjectSideBar'
import { getAssignmentsInProject, revokeProjectAuth } from '@services/assignment.services'
import { HttpResponse } from '@utils/Axios/HttpClientAuth'
import ProjectChatRoom from './partials/ProjectChatRoom'
import { useModal } from '@hooks/useModal'
import Modal from '@comps/Modal'
import routeLinks from '@routes/router'
import Button from '@comps/Button'
import toast from '@comps/Toast/toast'
import config from '@confs/app.config'
import { ProjectContextType } from '@hooks/useProjectOutletContext'
import { getFlatTasks } from '@utils/functions'

function Project() {
  const params = useParams() as ProjectPageParams
  const { board: project, members } = useProjectSelector()
  const response = useLoaderData() as HttpResponse<ProjectResponseForBoard>
  const dispatch = useDispatch()
  const [projectHub] = useState<ProjectHub>(new ProjectHub())
  const navigate = useNavigate()
  const remoteDragTimeOutId = useRef<number>()
  const [remoteDragging, setRemoteDragging] = useState<RemoteDraggingType>()
  const [isConnected, setIsConnected] = useState(false) // test
  const [removeAssignmentModal, handleToggleRemoveAssignmentModal] = useModal(false, {
    whenClose: () => navigate(routeLinks.home),
    whenOpen: async () => {
      await revokeProjectAuth()
      projectHub.disconnect()
    }
  })

  useEffect(() => {
    if (!project?.id || project?.id !== params.projectId) {
      if (response?.isSuccess) {
        const data = response.data
        dispatch(projectSlice.actions.setActiveProjectBoard(data))

        // sau khi tải dữ liệu thì khởi tạo kết nối thời gian thực
        projectHub.connectToHub(() => {
          handleListenHub(data)
          setIsConnected(true)
        }) // kết nối đến hub
      }
    }
    return () => {
      if (project?.id && project?.id !== params.projectId) {
        projectHub.disconnect()
        setIsConnected(_prev => false)
      }
    }
  }, [params?.projectId])

  const handleListenHub = (responseData: ProjectResponseForBoard) => {
    projectHub.connection?.on(hubs.project.receive.onlineMembers, (assignmentIds: string[]) => {
      dispatch(projectSlice.actions.setOnlineMembers(assignmentIds))
    })
    projectHub.connection?.on(
      hubs.project.receive.removeAssignment,
      (_assignmentId: string, data: DeletedAssignmentResponse) => {
        if (project.assignmentId === data.assignmentId) {
          handleToggleRemoveAssignmentModal()
        } else {
          // dispatch members
          dispatch(projectSlice.actions.removeAssignment(data.assignmentId))

          const member = members.find(a => a.id === data.assignmentId)
          toast.error('A member has been removed', `${member?.email} has been removed from this project`)
        }
      }
    )
    projectHub.connection?.on(
      hubs.project.receive.assignSubtask,
      (_assignmentIds: string, data: AssignSubtaskResponse) => {
        if (data.isNewAssignment) {
          // thay đổi store bên ngoài - dispatch
          const payload: AssignByTaskResponse = {
            assignerId: data.assignerId ?? '',
            assignmentIds: [data.assignmentId],
            taskId: data.taskId
          }

          if (payload.assignmentIds.findIndex(id => id === responseData.assignmentId) >= 0) {
            const tasks = getFlatTasks(responseData)
            if (tasks) {
              const task = tasks.find(t => t.id === data.taskId)
              toast.success('Assigned to task', `You was assigned to task ${task?.name}`)
            }
          }
          dispatch(projectSlice.actions.addAssignmentToTask(payload))
        }
        if (data.assignmentId === responseData.assignmentId) {
          toast.success(`You was assigned to subtask ${data.title}`, '')
        }
      }
    )
    // signalR listeners
    projectHub.connection?.on(hubs.project.receive.startDragList, (assignmentId: string, listId: string) => {
      setRemoteDragging({
        isDragging: true,
        subId: assignmentId,
        dragObjectId: listId,
        dragObject: 'Column'
      })

      // nếu có thêm một request nữa thì reset lại bộ đếm giờ
      if (remoteDragTimeOutId.current) {
        clearTimeout(remoteDragTimeOutId.current)
        remoteDragTimeOutId.current = undefined
      }

      // chờ 60s sau sẽ tự động tắt
      remoteDragTimeOutId.current = setTimeout(() => {
        setRemoteDragging(_prev => undefined)
        remoteDragTimeOutId.current = undefined
      }, config.timeOut.drag)
    })
    // ReceiveEndDragList
    projectHub.connection?.on(hubs.project.receive.endDragList, (_assignmentId: string, updatedListOrder: string) => {
      dispatch(projectSlice.actions.changeListOrder(updatedListOrder))
      setTimeout(() => {
        setRemoteDragging(_prev => undefined)

        // xoá đi bộ đếm giờ nếu nhận được tín hiệu ngừng dưới 60s
        if (remoteDragTimeOutId.current) {
          clearTimeout(remoteDragTimeOutId.current)
          remoteDragTimeOutId.current = undefined
        }
      }, config.timeOut.delayAfterEndDrag)
    })
    // ReceiveStartDragTask
    projectHub.connection?.on(
      hubs.project.receive.startDragTask,
      (assignmentId: string, _updatedListOrder: string, taskId: string) => {
        setRemoteDragging({
          isDragging: true,
          subId: assignmentId,
          dragObjectId: taskId,
          dragObject: 'Card'
        })

        // nếu có thêm một request nữa thì reset lại bộ đếm giờ
        if (remoteDragTimeOutId.current) {
          clearTimeout(remoteDragTimeOutId.current)
          remoteDragTimeOutId.current = undefined
        }

        // chờ 60s sau sẽ tự động tắt
        remoteDragTimeOutId.current = setTimeout(() => {
          setRemoteDragging(_prev => undefined)
          remoteDragTimeOutId.current = undefined
        }, config.timeOut.drag)
      }
    )
    // ReceiveEndDragTask
    projectHub.connection?.on(
      hubs.project.receive.endDragTask,
      (_assignmentId: string, res: ChangeTaskOrderResponse, dragResult: DragOverResult) => {
        console.log('Received drag operation - end task')
        dispatch(projectSlice.actions.changeTaskOrder({ resData: res, dragOverResult: dragResult }))
        // setRemoteDragging(undefined)
        setTimeout(() => {
          setRemoteDragging(_prev => undefined)

          // xoá đi bộ đếm giờ nếu nhận được tín hiệu ngừng dưới 60s
          if (remoteDragTimeOutId.current) {
            clearTimeout(remoteDragTimeOutId.current)
            remoteDragTimeOutId.current = undefined
          }
        }, config.timeOut.delayAfterEndDrag)
      }
    )
    // ReceiveUpdateTaskInfo
    projectHub.connection?.on(
      hubs.project.receive.updateTaskInfo,
      (_assignmentId: string, data: UpdatedTaskResponse) => {
        dispatch(projectSlice.actions.updateTaskInfo(data))
      }
    )
    // ReceiveAddSubtaskResult
    projectHub.connection?.on(
      hubs.project.receive.addSubtaskResult,
      (_assignmentId: string, taskid: string, subtasks: SubtaskForBoard[]) => {
        dispatch(projectSlice.actions.changeSubtaskCount({ taskId: taskid, subtaskCount: subtasks.length }))
      }
    )
    // ReceiveDeleteSubtask
    projectHub.connection?.on(
      hubs.project.receive.deleteSubtask,
      (_assignmentId: string, taskid: string, _subtaskId: number) => {
        dispatch(projectSlice.actions.changeSubtaskCount({ taskId: taskid, subtaskCount: -1 }))
      }
    )
    // ReceiveCheckSubtask
    projectHub.connection?.on(
      hubs.project.receive.checkSubtask,
      (_assignmentId: string, taskid: string, _subtaskId: number, status: boolean) => {
        dispatch(projectSlice.actions.changeSubtaskStatus({ taskId: taskid, status }))
      }
    )
    // ReceiveAddNewTask
    projectHub.connection?.on(hubs.project.receive.addNewTask, (_assignmentId: string, data: CreateTaskResponse) => {
      dispatch(projectSlice.actions.addNewTask(data))
    })
    // SendAddNewList
    projectHub.connection?.on(hubs.project.receive.addNewList, (_assignmentId: string, data: CreateListResponse) => {
      dispatch(projectSlice.actions.addNewList(data))
    })
    // SendDeleteList
    projectHub.connection?.on(hubs.project.receive.deleteList, (_assignmentId: string, listId: string) => {
      dispatch(projectSlice.actions.deleteList(listId))
    })
    projectHub.connection?.on(hubs.project.receive.markTask, (_assignmentId: string, data: MarkedTaskResponse) => {
      dispatch(projectSlice.actions.markTask(data))
    })
    projectHub.connection?.on(
      hubs.project.receive.assignMemberToTask,
      (_assignmentId: string, data: AssignByTaskResponse) => {
        if (data.assignmentIds.findIndex(id => id === responseData.assignmentId) >= 0) {
          const tasks = getFlatTasks(responseData)
          if (tasks) {
            const task = tasks.find(t => t.id === data.taskId)
            toast.success('Assigned to task', `You was assigned to task ${task?.name}`)
          }
        }
        dispatch(projectSlice.actions.addAssignmentToTask(data))
      }
    )
    projectHub.connection?.on(
      hubs.project.receive.duplicateTasks,
      (_assignmentId: string, data: TaskResponseForBoard) => {
        dispatch(projectSlice.actions.setDuplicateTasks(data))
      }
    )
    projectHub.connection?.on(hubs.project.receive.joinTask, (_assignmentId: string, data: JoinTaskResponse) => {
      dispatch(projectSlice.actions.joinTask(data))
    })
    projectHub.connection?.on(
      hubs.project.receive.unassignTaskAssignment,
      (_assignmentId: string, data: DeletedTaskAssignmentResponse) => {
        if (data.assignmentId === responseData.assignmentId) {
          const tasks = getFlatTasks(responseData)
          if (tasks) {
            const task = tasks.find(t => t.id === data.taskId)
            toast.error(`You was unassgned from task ${task?.name}`, '')
          }
        }
        dispatch(projectSlice.actions.removeTaskAssignment(data))
      }
    )
    projectHub.connection?.on(
      hubs.project.receive.addTaskDependencies,
      (_assignmentId: string, taskId: string, relatedTasks: RelatedTaskResponse[]) => {
        dispatch(
          projectSlice.actions.addFromDependencies({
            taskId,
            relatedTasks
          } as DispatchRelatedTaskResponse)
        )
      }
    )
    projectHub.connection?.on(
      hubs.project.receive.addChildrenTasks,
      (_assignmentId: string, taskId: string, relatedTasks: RelatedTaskResponse[]) => {
        dispatch(
          projectSlice.actions.addFromChildren({
            taskId,
            relatedTasks
          } as DispatchRelatedTaskResponse)
        )
      }
    )
    projectHub.connection?.on(
      hubs.project.receive.deleteTask,
      (_assignmentId: string, _taskId: string, data: DeletedTaskResponse, _moveToTrash: boolean) => {
        dispatch(projectSlice.actions.deleteTask(data))
      }
    )
    projectHub.connection?.on(
      hubs.project.receive.removeTaskDependency,
      (_assignmentId: string, _taskId: string, data: DeletedRelationshipResponse) => {
        dispatch(projectSlice.actions.removeFromDependencies(data))
      }
    )
    projectHub.connection?.on(
      hubs.project.receive.removeChildrenTask,
      (_assignmentId: string, _taskId: string, data: DeletedRelationshipResponse) => {
        dispatch(projectSlice.actions.removeFromChildren(data))
      }
    )
    projectHub.connection?.on(hubs.project.receive.updateWIP, (_assignmentId: string, data: UpdatedListResponse) => {
      dispatch(projectSlice.actions.updateListInfo(data))
    })
    projectHub.connection?.invoke(hubs.project.send.getOnlineMembers).catch(_ => {})
    // }
  }

  useEffect(() => {
    // tải thành viên của project
    if (project?.id && project.id === params.projectId)
      getAssignmentsInProject(project.id).then(res => {
        if (res?.isSuccess) {
          dispatch(projectSlice.actions.setProjectMembers(res.data))
        } else {
          console.log('Can not get project members', res?.data)
        }
      })
  }, [project?.id, params.projectId])

  return (
    <>
      {project && (
        <Flex $flexDirection='column' style={{ width: '100%', height: '100%' }}>
          <ProjectHeader />
          <Suspense
            fallback={
              <>
                <LoadingLayout className='row jcc' style={{ width: '100%', height: '100%' }} isLoading />
              </>
            }
          >
            <Flex className='w-full flex-1' style={{ overflow: 'hidden' }} $gap='0.5rem'>
              <ProjectSideBar />
              {isConnected && <Outlet context={{ remoteDragging } satisfies ProjectContextType} />}
              {/* <Outlet context={{ remoteDragging } satisfies ProjectContextType} /> */}
            </Flex>
          </Suspense>
          <ProjectChatRoom />
        </Flex>
      )}
      <Modal
        layout={{
          header: { title: 'You was kicked out from this project', closeIcon: true },
          footer: (
            <Button onClick={handleToggleRemoveAssignmentModal} variant='filled' theme='danger'>
              Exit
            </Button>
          )
        }}
        open={removeAssignmentModal}
        onClose={handleToggleRemoveAssignmentModal}
      >
        <p className='text-danger'>You was kicked out from this project!</p>
      </Modal>
    </>
  )
}

export default Project
