import { http } from '@utils/Axios/HttpClientAuth'
import {
  CreateProjectModel,
  ProjectResponse,
  ProjectResponseForBoard,
  ProjectResponseForUpdating,
  UpdateProjectModel,
  UpdateProjectResponse
} from '@utils/types/project.type'
import { AssignmentResponse } from '@utils/types/assignment.type'
import { CreateProjectResponse } from '@utils/types/project.type'

const createProject = async (model: CreateProjectModel) => {
  const res = await http.post<CreateProjectModel, CreateProjectResponse>('/projects', model)
  return res
}

const getUpdateProject = async (projectId: string) => {
  const res = await http.get<ProjectResponseForUpdating>(`/projects/${projectId}/updating`)
  return res
}

const updateProject = async (projectId: string, data: UpdateProjectModel) => {
  const res = await http.put<UpdateProjectModel, UpdateProjectResponse>(`/projects/${projectId}`, data)
  return res
}

// const getProjectForDisplaying = async (projectId: string, viewMode: string) => {
//   const res = await http.get<ProjectResponseForBoard>(`/v2/projects/${projectId}/v/${viewMode}`)
//   return res
// }
const getProjectForDisplaying = async (projectId: string, viewMode: string) => {
  const res = await http.get<ProjectResponseForBoard>(`/v3/projects/${projectId}/v/${viewMode}`)
  return res
}

const inviteToProjectByEmail = async (projectId: string, invitation: { email: string; permission: string }) => {
  const res = await http.post<{ email: string; permission: string }>(`/projects/${projectId}/invite`, invitation)
  return res
}

const getJoinedProjects = async (currentProjectId: string) => {
  const res = await http.get<ProjectResponse[]>(`/projects/all?exceptId=${currentProjectId}`)
  return res
}

const inviteToProjectByAnotherMember = async (projectId: string, data: any) => {
  const res = await http.post(`/projects/${projectId}/invite/existed-user`, data)
  return res
}

const getOtherAssignmentsInProject = async (projectId: string) => {
  const res = await http.get<AssignmentResponse[]>(`/assignments/in-project/${projectId}?exceptMe=true`)
  return res
}

export {
  createProject,
  getUpdateProject,
  updateProject,
  getProjectForDisplaying,
  inviteToProjectByEmail,
  getJoinedProjects,
  getOtherAssignmentsInProject,
  inviteToProjectByAnotherMember
}
