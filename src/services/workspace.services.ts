import {http} from '@utils/Axios/HttpClientAuth'
import { WorkspaceResponse } from '@utils/types'

const loadWorkspaces = async () => {
  const res = await http.get<WorkspaceResponse[]>('/workspaces')
  return res
}

export { loadWorkspaces }
