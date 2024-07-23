import { getSlug } from '@utils/functions'
import HttpClient from '@utils/HttpClient'
import { ProjectPageParams, WorkspacePageParams } from '@utils/types'
import { LoaderFunctionArgs } from 'react-router-dom'

const routeLinks = {
  welcome: '/',
  home: '/home',
  yourTasks: '/your-tasks',
  workspaces: '/workspaces/:ownerShip/:slug/:workspaceId',
  project: '/projects/:ownerShip/:slug/:projectId/v/:viewMode',
  task: 'task/:taskId',
  members: 'members',
  share: 'share-project',
  projectInvitation: '/invited-projects'
}

const http = new HttpClient()

export const linkCreator = {
  workspaces(routeParams: WorkspacePageParams) {
    const { ownerShip, slug, workspaceId } = routeParams
    return `/workspaces/${ownerShip}/${slug}/${workspaceId}`
  },
  project(routeParams: ProjectPageParams) {
    const { ownerShip, projectId, slug, viewMode } = routeParams
    return `/projects/${ownerShip}/${getSlug(slug)}/${projectId}/v/${viewMode}`
  }
}
export const loader = {
  workspace: async ({ params }: LoaderFunctionArgs) => {
    const { ownerShip } = params as WorkspacePageParams
    const prefixPath = ownerShip === 'owner' ? 'w' : 'sw'
    const res = await http.getAuth(`/${prefixPath}/${params.workspaceId}/projects`)
    return res
  },
  invitation: async ({ params }: LoaderFunctionArgs) => {
    const res = await http.getAuth(`/invited-projects`)
    return res
  }
}

export default routeLinks
