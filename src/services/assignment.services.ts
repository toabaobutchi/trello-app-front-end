import { http } from '@utils/Axios/HttpClientAuth'
import { AssignmentProfileResponse, AssignmentResponse, ChangePermissionResonse, DeletedAssignmentResponse } from '@utils/types/assignment.type'
import { DeleteTaskAssignmentModel, DeletedTaskAssignmentResponse } from '@utils/types/task-assignment.type'
import { AssignByTaskModel, AssignByTaskResponse } from '@utils/types/task.type'

const getAssignmentsInProject = async (projectId: string, exceptMe: boolean = false) => {
  const res = await http.get<AssignmentResponse[]>(
    `/assignments/in-project/${projectId}${exceptMe ? '?exceptMe=true' : ''}`
  )
  return res
}

const getAssignmentProfile = async (assignmentId: string) => {
  const res = await http.get<AssignmentProfileResponse>(`/assignments/${assignmentId}/profile`)
  return res
}

const assignMembersToTask = async (taskId: string, model: AssignByTaskModel) => {
  const res = await http.post<AssignByTaskModel, AssignByTaskResponse>(`/assignments/assign-to-task/${taskId}`, model)
  return res
}

const getAssignmentsFromAnotherProject = async (projectId: string) => {
  const res = await http.get<AssignmentResponse[]>(`/assignments/in-other-project/${projectId}`)
  return res
}

const unassignTaskAssignment = async (taskId: string, model: DeleteTaskAssignmentModel) => {
  const res = await http.post<DeleteTaskAssignmentModel, DeletedTaskAssignmentResponse>(
    `/assignments/unassign-from-task/${taskId}`,
    model
  )
  return res
}

const removeAssignment = async (assignmentId: string) => {
  const res = await http.delete<DeletedAssignmentResponse>(`/assignments/remove/${assignmentId}`)
  return res
}

const revokeProjectAuth = async () => {
  const res = await http.postWithoutData(`/projects/auth/revoke`)
  return res
}

const changePermission = async (assignmentId: string, permission: string) => {
  const res = await http.put<{ permission: string }, ChangePermissionResonse>(
    `/assignments/change-permission/${assignmentId}`,
    { permission }
  )
  return res
}

export {
  getAssignmentsInProject,
  getAssignmentProfile,
  assignMembersToTask,
  getAssignmentsFromAnotherProject,
  unassignTaskAssignment,
  removeAssignment,
  revokeProjectAuth,
  changePermission
}
