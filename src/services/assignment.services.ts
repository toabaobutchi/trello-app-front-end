import { http } from '@utils/Axios/HttpClientAuth'
import { AssignByTaskModel, AssignByTaskResponse, AssignmentProfileResponse, AssignmentResponse } from '@utils/types'

const getAssignmentsInProject = async (projectId: string) => {
  const res = await http.get<AssignmentResponse[]>(`/assignments/in-project/${projectId}?exceptMe=true`)
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

export { getAssignmentsInProject, getAssignmentProfile, assignMembersToTask }
