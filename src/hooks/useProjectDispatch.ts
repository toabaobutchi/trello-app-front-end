import { projectSlice } from '@redux/ProjectSlice'
import { DragOverResult, ProjectFilterType } from '@utils/types'
import { AssignmentResponse, ChangePermissionResonse } from '@utils/types/assignment.type'
import { CreateListResponse, DeletedListResponse, UpdatedListResponse } from '@utils/types/list.type'
import { ProjectResponseForBoard } from '@utils/types/project.type'
import { DeletedTaskAssignmentResponse } from '@utils/types/task-assignment.type'
import {
  AssignByTaskResponse,
  ChangeTaskOrderResponse,
  CreateTaskResponse,
  DeletedRelationshipResponse,
  DeletedTaskResponse,
  DispatchRelatedTaskResponse,
  JoinTaskResponse,
  MarkedTaskResponse,
  TaskResponseForBoard,
  UpdatedTaskResponse
} from '@utils/types/task.type'
import { useDispatch } from 'react-redux'

export default function useProjectDispatch() {
  const dispatch = useDispatch()
  return {
    changePermission: (payload: ChangePermissionResonse) => dispatch(projectSlice.actions.changePermission(payload)),
    removeAssignment: (payload: string) => dispatch(projectSlice.actions.removeAssignment(payload)),
    removeFromChildren: (payload: DeletedRelationshipResponse) =>
      dispatch(projectSlice.actions.removeFromChildren(payload)),
    removeFromDependencies: (payload: DeletedRelationshipResponse) =>
      dispatch(projectSlice.actions.removeFromDependencies(payload)),
    addFromChildren: (payload: DispatchRelatedTaskResponse) => dispatch(projectSlice.actions.addFromChildren(payload)),
    addFromDependencies: (payload: DispatchRelatedTaskResponse) =>
      dispatch(projectSlice.actions.addFromDependencies(payload)),
    removeTaskAssignment: (payload: DeletedTaskAssignmentResponse) =>
      dispatch(projectSlice.actions.removeTaskAssignment(payload)),
    addAssignmentToTask: (payload: AssignByTaskResponse) => dispatch(projectSlice.actions.addAssignmentToTask(payload)),
    markTask: (payload: MarkedTaskResponse) => dispatch(projectSlice.actions.markTask(payload)),
    deleteList: (payload: DeletedListResponse) => dispatch(projectSlice.actions.deleteList(payload)),
    joinTask: (payload: JoinTaskResponse) => dispatch(projectSlice.actions.joinTask(payload)),
    changeSubtaskStatus: (payload: { taskId: string; status: boolean }) =>
      dispatch(projectSlice.actions.changeSubtaskStatus(payload)),
    changeSubtaskCount: (payload: { taskId: string; subtaskCount: number }) =>
      dispatch(projectSlice.actions.changeSubtaskCount(payload)),
    updateTaskInfo: (payload: UpdatedTaskResponse) => dispatch(projectSlice.actions.updateTaskInfo(payload)),
    updateListInfo: (payload: UpdatedListResponse) => dispatch(projectSlice.actions.updateListInfo(payload)),
    deleteTask: (payload: DeletedTaskResponse) => dispatch(projectSlice.actions.deleteTask(payload)),
    setActiveProjectBoard: (payload: ProjectResponseForBoard) =>
      dispatch(projectSlice.actions.setActiveProjectBoard(payload)),
    addNewList: (payload: CreateListResponse) => dispatch(projectSlice.actions.addNewList(payload)),
    addNewTask: (payload: CreateTaskResponse) => dispatch(projectSlice.actions.addNewTask(payload)),
    changeListOrder: (payload: string) => dispatch(projectSlice.actions.changeListOrder(payload)),
    changeTaskOrder: (payload: { resData?: ChangeTaskOrderResponse; dragOverResult?: DragOverResult }) =>
      dispatch(projectSlice.actions.changeTaskOrder(payload)),
    setProjectMembers: (payload: AssignmentResponse[]) => dispatch(projectSlice.actions.setProjectMembers(payload)),
    setOnlineMembers: (payload: string[]) => dispatch(projectSlice.actions.setOnlineMembers(payload)),
    setDuplicateTasks: (payload: TaskResponseForBoard[]) => dispatch(projectSlice.actions.setDuplicateTasks(payload)),
    setFilters: (payload: ProjectFilterType) => dispatch(projectSlice.actions.setFilters(payload))
  }
}
