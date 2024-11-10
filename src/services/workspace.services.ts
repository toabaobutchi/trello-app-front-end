import { http } from '@utils/Axios/HttpClientAuth'
import {
  CreateWorkspaceModel,
  WorkspaceResponse,
  WorkspaceResponseWithRelatedProjects,
  WorkspaceUpdateModel
} from '@utils/types/workspace.type'

const workspacePrefix = '/workspaces'
const sharedWorkspacePrefix = '/shared-workspaces'

const loadWorkspaces = async () => {
  const res = await http.get<WorkspaceResponse[]>(workspacePrefix)
  return res
}

const loadSharedWorkspaces = async () => {
  const res = await http.get<WorkspaceResponse[]>(sharedWorkspacePrefix)
  return res
}

const createWorkspace = async (newWorkspace: CreateWorkspaceModel) => {
  const res = await http.post<CreateWorkspaceModel, WorkspaceResponse>(workspacePrefix, newWorkspace)
  return res
}

const updateWorkspace = async (workspaceId: string | number, model: WorkspaceUpdateModel) => {
  const res = await http.put<WorkspaceUpdateModel, WorkspaceResponse>(`${workspacePrefix}/${workspaceId}`, model)
  return res
}

const getWorkspaceWithProjects = async (ownerShip: string, workspaceId: string) => {
  const prefixPath = ownerShip.toLowerCase() === 'owner' ? workspacePrefix : sharedWorkspacePrefix
  const res = await http.get<WorkspaceResponseWithRelatedProjects>(`${prefixPath}/${workspaceId}/projects`)
  return res
}

export { loadWorkspaces, createWorkspace, loadSharedWorkspaces, updateWorkspace, getWorkspaceWithProjects }
