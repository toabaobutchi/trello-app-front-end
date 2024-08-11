import { useProjectSelector } from '@hooks/useProjectSelector'
import { ProjectPageParams } from '@utils/types'
import { Outlet, useParams } from 'react-router-dom'
import BoardContent from '../BoardContent'
import TableContent from '../TableContent'
function ViewContent() {
  const params = useParams() as ProjectPageParams
  const { board: project } = useProjectSelector()

  // signalr listeners
  // useEffect(() => {
  //   if (project?.id && projectHub.isConnected) {
  //     // ReceiveStartDragList
  //     projectHub.connection?.on(hubs.project.receive.startDragList, (assignmentId: string, listId: string) => {
  //       setRemoteDragging({
  //         isDragging: true,
  //         subId: assignmentId,
  //         dragObjectId: listId,
  //         dragObject: 'Column'
  //       })

  //       // nếu có thêm một request nữa thì reset lại bộ đếm giờ
  //       if (remoteDragTimeOutId.current) {
  //         clearTimeout(remoteDragTimeOutId.current)
  //         remoteDragTimeOutId.current = undefined
  //       }

  //       // chờ 60s sau sẽ tự động tắt
  //       remoteDragTimeOutId.current = setTimeout(() => {
  //         setRemoteDragging(_prev => undefined)
  //         remoteDragTimeOutId.current = undefined
  //       }, config.timeOut.drag)
  //     })

  //     // ReceiveEndDragList
  //     projectHub.connection?.on(hubs.project.receive.endDragList, (_assignmentId: string, updatedListOrder: string) => {
  //       dispatch(projectSlice.actions.changeListOrder(updatedListOrder))
  //       setTimeout(() => {
  //         setRemoteDragging(_prev => undefined)

  //         // xoá đi bộ đếm giờ nếu nhận được tín hiệu ngừng dưới 60s
  //         if (remoteDragTimeOutId.current) {
  //           clearTimeout(remoteDragTimeOutId.current)
  //           remoteDragTimeOutId.current = undefined
  //         }
  //       }, config.timeOut.delayAfterEndDrag)
  //     })

  //     // ReceiveStartDragTask
  //     projectHub.connection?.on(
  //       hubs.project.receive.startDragTask,
  //       (assignmentId: string, _updatedListOrder: string, taskId: string) => {
  //         setRemoteDragging({
  //           isDragging: true,
  //           subId: assignmentId,
  //           dragObjectId: taskId,
  //           dragObject: 'Card'
  //         })

  //         // nếu có thêm một request nữa thì reset lại bộ đếm giờ
  //         if (remoteDragTimeOutId.current) {
  //           clearTimeout(remoteDragTimeOutId.current)
  //           remoteDragTimeOutId.current = undefined
  //         }

  //         // chờ 60s sau sẽ tự động tắt
  //         remoteDragTimeOutId.current = setTimeout(() => {
  //           setRemoteDragging(_prev => undefined)
  //           remoteDragTimeOutId.current = undefined
  //         }, config.timeOut.drag)
  //       }
  //     )
  //     // ReceiveEndDragTask
  //     projectHub.connection?.on(
  //       hubs.project.receive.endDragTask,
  //       (_assignmentId: string, res: ChangeTaskOrderResponse, dragResult: DragOverResult) => {
  //         dispatch(projectSlice.actions.changeTaskOrder({ resData: res, dragOverResult: dragResult }))
  //         // setRemoteDragging(undefined)
  //         setTimeout(() => {
  //           setRemoteDragging(_prev => undefined)

  //           // xoá đi bộ đếm giờ nếu nhận được tín hiệu ngừng dưới 60s
  //           if (remoteDragTimeOutId.current) {
  //             clearTimeout(remoteDragTimeOutId.current)
  //             remoteDragTimeOutId.current = undefined
  //           }
  //         }, config.timeOut.delayAfterEndDrag)
  //       }
  //     )
  //     // ReceiveUpdateTaskInfo
  //     projectHub.connection?.on(
  //       hubs.project.receive.updateTaskInfo,
  //       (_assignmentId: string, data: UpdatedTaskResponse) => {
  //         dispatch(projectSlice.actions.updateTaskInfo(data))
  //       }
  //     )
  //     // ReceiveAddSubtaskResult
  //     projectHub.connection?.on(
  //       hubs.project.receive.addSubtaskResult,
  //       (_assignmentId: string, taskid: string, subtasks: SubtaskForBoard[]) => {
  //         dispatch(projectSlice.actions.changeSubtaskCount({ taskId: taskid, subtaskCount: subtasks.length }))
  //       }
  //     )
  //     // ReceiveDeleteSubtask
  //     projectHub.connection?.on(
  //       hubs.project.receive.deleteSubtask,
  //       (_assignmentId: string, taskid: string, _subtaskId: number) => {
  //         dispatch(projectSlice.actions.changeSubtaskCount({ taskId: taskid, subtaskCount: -1 }))
  //       }
  //     )
  //     // ReceiveCheckSubtask
  //     projectHub.connection?.on(
  //       hubs.project.receive.checkSubtask,
  //       (_assignmentId: string, taskid: string, _subtaskId: number, status: boolean) => {
  //         dispatch(projectSlice.actions.changeSubtaskStatus({ taskId: taskid, status }))
  //       }
  //     )
  //     // ReceiveAddNewTask
  //     projectHub.connection?.on(hubs.project.receive.addNewTask, (_assignmentId: string, data: CreateTaskResponse) => {
  //       dispatch(projectSlice.actions.addNewTask(data))
  //     })
  //     // SendAddNewList
  //     projectHub.connection?.on(hubs.project.receive.addNewList, (_assignmentId: string, data: CreateListResponse) => {
  //       dispatch(projectSlice.actions.addNewList(data))
  //     })
  //     // SendDeleteList
  //     projectHub.connection?.on(hubs.project.receive.deleteList, (_assignmentId: string, listId: string) => {
  //       dispatch(projectSlice.actions.deleteList(listId))
  //     })
  //     projectHub.connection?.on(hubs.project.receive.markTask, (_assignmentId: string, data: MarkedTaskResponse) => {
  //       dispatch(projectSlice.actions.markTask(data))
  //     })
  //     projectHub.connection?.on(
  //       hubs.project.receive.assignMemberToTask,
  //       (_assignmentId: string, data: AssignByTaskResponse) => {
  //         dispatch(projectSlice.actions.addAssignmentToTask(data))
  //       }
  //     )
  //     projectHub.connection?.on(
  //       hubs.project.receive.duplicateTasks,
  //       (_assignmentId: string, data: TaskResponseForBoard) => {
  //         dispatch(projectSlice.actions.setDuplicateTasks(data))
  //       }
  //     )
  //     projectHub.connection?.on(hubs.project.receive.joinTask, (_assignmentId: string, data: JoinTaskResponse) => {
  //       dispatch(projectSlice.actions.joinTask(data))
  //     })
  //     projectHub.connection?.on(
  //       hubs.project.receive.unassignTaskAssignment,
  //       (_assignmentId: string, data: DeletedTaskAssignmentResponse) => {
  //         dispatch(projectSlice.actions.removeTaskAssignment(data))
  //       }
  //     )
  //     projectHub.connection?.on(
  //       hubs.project.receive.addTaskDependencies,
  //       (_assignmentId: string, taskId: string, relatedTasks: RelatedTaskResponse[]) => {
  //         console.log('addTaskDependencies')
  //         dispatch(
  //           projectSlice.actions.addFromDependencies({
  //             taskId,
  //             relatedTasks
  //           } as DispatchRelatedTaskResponse)
  //         )
  //       }
  //     )
  //     projectHub.connection?.on(
  //       hubs.project.receive.addChildrenTasks,
  //       (_assignmentId: string, taskId: string, relatedTasks: RelatedTaskResponse[]) => {
  //         dispatch(
  //           projectSlice.actions.addFromChildren({
  //             taskId,
  //             relatedTasks
  //           } as DispatchRelatedTaskResponse)
  //         )
  //       }
  //     )
  //     projectHub.connection?.on(
  //       hubs.project.receive.deleteTask,
  //       (_assignmentId: string, _taskId: string, data: DeletedTaskResponse, _moveToTrash: boolean) => {
  //         dispatch(projectSlice.actions.deleteTask(data))
  //       }
  //     )
  //     projectHub.connection?.on(
  //       hubs.project.receive.removeTaskDependency,
  //       (_assignmentId: string, _taskId: string, data: DeletedRelationshipResponse) => {
  //         dispatch(projectSlice.actions.removeFromDependencies(data))
  //       }
  //     )
  //     projectHub.connection?.on(
  //       hubs.project.receive.removeChildrenTask,
  //       (_assignmentId: string, _taskId: string, data: DeletedRelationshipResponse) => {
  //         dispatch(projectSlice.actions.removeFromChildren(data))
  //       }
  //     )
  //     // eslint-disable-next-line react-hooks/exhaustive-deps
  //   }
  // }, [projectHub.isConnected, project?.id])
  return (
    <>
      {project?.id && project.id === params.projectId && (
        <>
          {params.viewMode === 'board' && <BoardContent />}
          {params.viewMode === 'table' && <TableContent />}
        </>
      )}
      <Outlet />
    </>
  )
}

export default ViewContent
