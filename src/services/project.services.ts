import { http } from '@utils/Axios/HttpClientAuth'
import {
  CreateProjectModel,
  ProjectContextResponse,
  ProjectResponseForBoard,
  ProjectResponseForUpdating,
  UpdateProjectModel,
  UpdateProjectResponse
} from '@utils/types'

const createProject = async (model: CreateProjectModel) => {
  const res = await http.post<CreateProjectModel, ProjectContextResponse>('/projects', model)
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

const getProjectForDisplaying = async (projectId: string, viewMode: string) => {
  const res = await http.get<ProjectResponseForBoard>(`/v2/projects/${projectId}/v/${viewMode}`)
  return res
}

export { createProject, getUpdateProject, updateProject, getProjectForDisplaying }
