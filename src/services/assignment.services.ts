import { http } from '@utils/Axios/HttpClientAuth'
import {
  AssignByTaskModel,
  AssignByTaskResponse,
  AssignmentProfileResponse,
  AssignmentResponse,
  DeleteAssignmentModel,
  DeletedAssignmentResponse,
  DeletedTaskAssignmentResponse,
  DeleteTaskAssignmentModel
} from '@utils/types'

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

export {
  getAssignmentsInProject,
  getAssignmentProfile,
  assignMembersToTask,
  getAssignmentsFromAnotherProject,
  unassignTaskAssignment,
  removeAssignment
}
