import { http } from '@utils/Axios/HttpClientAuth'
import {
  CreateWorkspaceModel,
  WorkspaceResponse,
  WorkspaceResponseWithRelatedProjects,
  WorkspaceUpdateModel
} from '@utils/types'

const loadWorkspaces = async () => {
  const res = await http.get<WorkspaceResponse[]>('/workspaces')
  return res
}

const loadSharedWorkspaces = async () => {
  const res = await http.get<WorkspaceResponse[]>(`/shared-workspaces`)
  return res
}

const createWorkspace = async (newWorkspace: CreateWorkspaceModel) => {
  const res = await http.post<CreateWorkspaceModel, WorkspaceResponse>(`/workspaces`, newWorkspace)
  return res
}

const updateWorkspace = async (workspaceId: string | number, model: WorkspaceUpdateModel) => {
  const res = await http.put<WorkspaceUpdateModel, WorkspaceResponse>(`/workspaces/${workspaceId}`, model)
  return res
}

const getWorkspaceWithProjects = async (ownerShip: string, workspaceId: string) => {
  const prefixPath = ownerShip === 'owner' ? 'w' : 'sw'
  const res = await http.get<WorkspaceResponseWithRelatedProjects>(`/${prefixPath}/${workspaceId}/projects`)
  return res
}

export { loadWorkspaces, createWorkspace, loadSharedWorkspaces, updateWorkspace, getWorkspaceWithProjects }
