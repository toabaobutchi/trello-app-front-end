import Button from '@comps/Button'
import Modal from '@comps/Modal'
import Flex from '@comps/StyledComponents/Flex'
import toast from '@comps/Toast/toast'
import config from '@confs/app.config'
import { useModal } from '@hooks/useModal'
import { usePageParams } from '@hooks/usePageParams'
import useProjectDispatch from '@hooks/useProjectDispatch'
import useProjectHub from '@hooks/useProjectHub'
import { ProjectContextType } from '@hooks/useProjectOutletContext'
import { useProjectSelector } from '@hooks/useProjectSelector'
import routeLinks from '@routes/router'
import { getAssignmentsInProject, revokeProjectAuth } from '@services/assignment.services'
import { HttpResponse } from '@utils/Axios/HttpClientAuth'
import { getFlatTasks } from '@utils/functions'
import { hubs } from '@utils/Hubs'
import { DragOverResult, RemoteDraggingType } from '@utils/types'
import { DeletedAssignmentResponse } from '@utils/types/assignment.type'
import { CreateListResponse, DeletedListResponse, UpdatedListResponse } from '@utils/types/list.type'
import { ProjectPageParams } from '@utils/types/page-params.type'
import { ProjectResponseForBoard } from '@utils/types/project.type'
import { AssignSubtaskResponse, SubtaskForBoard } from '@utils/types/subtask.type'
import { DeletedTaskAssignmentResponse } from '@utils/types/task-assignment.type'
import {
  AssignByTaskResponse,
  ChangeTaskOrderResponse,
  CreateTaskResponse,
  DeletedRelationshipResponse,
  DeletedTaskResponse,
  JoinTaskResponse,
  MarkedTaskResponse,
  RelatedTaskResponse,
  TaskResponseForBoard,
  UpdatedTaskResponse
} from '@utils/types/task.type'
import { useEffect, useRef, useState } from 'react'
import { Outlet, useLoaderData, useNavigate } from 'react-router-dom'
import ProjectChatRoom from './partials/ProjectChatRoom'
import ProjectHeader from './partials/ProjectHeader'
import ProjectSideBar from './partials/ProjectSideBar'
import './Project.scss'

function Project() {
  const params = usePageParams<ProjectPageParams>()
  const { board: project, members } = useProjectSelector()
  const response = useLoaderData() as HttpResponse<ProjectResponseForBoard>
  const projectDispatch = useProjectDispatch()
  const projectHub = useProjectHub()
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
        projectDispatch.setActiveProjectBoard(data)

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
      projectDispatch.setOnlineMembers(assignmentIds)
    })
    projectHub.connection?.on(
      hubs.project.receive.removeAssignment,
      (_assignmentId: string, data: DeletedAssignmentResponse) => {
        if (project.assignmentId === data.assignmentId) {
          handleToggleRemoveAssignmentModal()
        } else {
          // dispatch members
          projectDispatch.removeAssignment(data.assignmentId)

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
          projectDispatch.addAssignmentToTask(payload)
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
      projectDispatch.changeListOrder(updatedListOrder)
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
        projectDispatch.changeTaskOrder({ resData: res, dragOverResult: dragResult })
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
        projectDispatch.updateTaskInfo(data)
      }
    )
    // ReceiveAddSubtaskResult
    projectHub.connection?.on(
      hubs.project.receive.addSubtaskResult,
      (_assignmentId: string, taskid: string, subtasks: SubtaskForBoard[]) => {
        projectDispatch.changeSubtaskCount({ taskId: taskid, subtaskCount: subtasks.length })
      }
    )
    // ReceiveDeleteSubtask
    projectHub.connection?.on(
      hubs.project.receive.deleteSubtask,
      (_assignmentId: string, taskid: string, _subtaskId: number) => {
        projectDispatch.changeSubtaskCount({ taskId: taskid, subtaskCount: -1 })
      }
    )
    // ReceiveCheckSubtask
    projectHub.connection?.on(
      hubs.project.receive.checkSubtask,
      (_assignmentId: string, taskid: string, _subtaskId: number, status: boolean) => {
        projectDispatch.changeSubtaskStatus({ taskId: taskid, status })
      }
    )
    // ReceiveAddNewTask
    projectHub.connection?.on(hubs.project.receive.addNewTask, (_assignmentId: string, data: CreateTaskResponse) => {
      projectDispatch.addNewTask(data)
    })
    // SendAddNewList
    projectHub.connection?.on(hubs.project.receive.addNewList, (_assignmentId: string, data: CreateListResponse) => {
      projectDispatch.addNewList(data)
    })
    // SendDeleteList
    projectHub.connection?.on(hubs.project.receive.deleteList, (_assignmentId: string, data: DeletedListResponse) => {
      projectDispatch.deleteList(data)
    })
    projectHub.connection?.on(hubs.project.receive.markTask, (_assignmentId: string, data: MarkedTaskResponse) => {
      projectDispatch.markTask(data)
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
        projectDispatch.addAssignmentToTask(data)
      }
    )
    projectHub.connection?.on(
      hubs.project.receive.duplicateTasks,
      (_assignmentId: string, data: TaskResponseForBoard[]) => {
        projectDispatch.setDuplicateTasks(data)
      }
    )
    projectHub.connection?.on(hubs.project.receive.joinTask, (_assignmentId: string, data: JoinTaskResponse) => {
      projectDispatch.joinTask(data)
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
        projectDispatch.removeTaskAssignment(data)
      }
    )
    projectHub.connection?.on(
      hubs.project.receive.addTaskDependencies,
      (_assignmentId: string, taskId: string, relatedTasks: RelatedTaskResponse[]) => {
        projectDispatch.addFromDependencies({
          taskId,
          relatedTasks
        })
      }
    )
    projectHub.connection?.on(
      hubs.project.receive.addChildrenTasks,
      (_assignmentId: string, taskId: string, relatedTasks: RelatedTaskResponse[]) => {
        projectDispatch.addFromChildren({
          taskId,
          relatedTasks
        })
      }
    )
    projectHub.connection?.on(
      hubs.project.receive.deleteTask,
      (_assignmentId: string, _taskId: string, data: DeletedTaskResponse, _moveToTrash: boolean) => {
        projectDispatch.deleteTask(data)
      }
    )
    projectHub.connection?.on(
      hubs.project.receive.removeTaskDependency,
      (_assignmentId: string, _taskId: string, data: DeletedRelationshipResponse) => {
        projectDispatch.removeFromDependencies(data)
      }
    )
    projectHub.connection?.on(
      hubs.project.receive.removeChildrenTask,
      (_assignmentId: string, _taskId: string, data: DeletedRelationshipResponse) => {
        projectDispatch.removeFromChildren(data)
      }
    )
    projectHub.connection?.on(hubs.project.receive.updateWIP, (_assignmentId: string, data: UpdatedListResponse) => {
      projectDispatch.updateListInfo(data)
    })
    projectHub.connection?.invoke(hubs.project.send.getOnlineMembers).catch(_ => {})
    // }
  }

  useEffect(() => {
    // tải thành viên của project
    if (project?.id && project.id === params.projectId)
      getAssignmentsInProject(project.id).then(res => {
        if (res?.isSuccess) {
          projectDispatch.setProjectMembers(res.data)
        } else {
          toast.error('Can not get project members', '')
        }
      })
  }, [project?.id, params.projectId])

  return (
    <>
      {project && (
        <Flex $flexDirection='column' style={{ width: '100%', height: '100%' }}>
          <ProjectHeader />
            <Flex className='w-full flex-1' style={{ overflow: 'hidden' }} $gap='0.5rem'>
              <ProjectSideBar />
              {isConnected && <Outlet context={{ remoteDragging } satisfies ProjectContextType} />}
            </Flex>
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
