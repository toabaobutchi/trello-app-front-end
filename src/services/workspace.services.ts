import { http } from '@utils/Axios/HttpClientAuth'
import { CreateWorkspaceModel, WorkspaceResponse } from '@utils/types'

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

export { loadWorkspaces, createWorkspace, loadSharedWorkspaces }
