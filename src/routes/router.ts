import { getSlug } from '@utils/functions'
import { ProjectPageParams, WorkspacePageParams } from '@utils/types'

const routeLinks = {
  welcome: '/',
  home: '/home',
  yourTasks: '/your-tasks',
  workspaces: '/workspaces/:ownerShip/:slug/:workspaceId',
  project: '/projects/:ownerShip/:slug/:projectId/v/:viewMode',
  // projectInvitation: '/projects/:pid/invitation'
  projectInvitation: '/projects/invitation'
}

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

export default routeLinks
