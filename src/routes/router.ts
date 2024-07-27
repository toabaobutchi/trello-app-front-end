import { getInvitedProjects } from '@services/invitation.services'
import { getProjectForDisplaying } from '@services/project.services'
import { getRecycleBin } from '@services/task.services'
import { getWorkspaceWithProjects } from '@services/workspace.services'
import { getSlug } from '@utils/functions'
import { ProjectPageParams, WorkspacePageParams } from '@utils/types'
import { LoaderFunctionArgs } from 'react-router-dom'

const routeLinks = {
  welcome: '/',
  home: '/home',
  yourTasks: '/your-tasks',
  workspaces: '/workspaces/:ownerShip/:slug/:workspaceId',
  project: {
    index: '/projects/:ownerShip/:slug/:projectId',
    task: 'task/:taskId',
    share: 'share-project',
    recycleBin: 'recycle-bin',
    members: {
      index: 'members',
      detail: ':memberId'
    },
    view: 'v/:viewMode'
  },
  projectInvitation: '/invited-projects'
}

export const linkCreator = {
  workspaces(routeParams: WorkspacePageParams) {
    const { ownerShip, slug, workspaceId } = routeParams
    return `/workspaces/${ownerShip}/${slug}/${workspaceId}`
  },
  project(routeParams: ProjectPageParams) {
    const { ownerShip, projectId, slug, viewMode } = routeParams
    return `/projects/${ownerShip}/${getSlug(slug)}/${projectId}/v/${viewMode}`
  },
  projectMember(routeParams: ProjectPageParams, memberId?: string) {
    const { ownerShip, projectId, slug } = routeParams
    return `/projects/${ownerShip}/${getSlug(slug)}/${projectId}/${routeLinks.project.members.index}${
      memberId ? '/' + memberId : ''
    }`
  },
  projectRecycleBin(routeParams: ProjectPageParams) {
    const { ownerShip, projectId, slug } = routeParams
    return `/projects/${ownerShip}/${getSlug(slug)}/${projectId}/${routeLinks.project.recycleBin}`
  },
  shareProject(routeParams: ProjectPageParams) {
    const { ownerShip, projectId, slug } = routeParams
    return `/projects/${ownerShip}/${getSlug(slug)}/${projectId}/${routeLinks.project.share}`
  }
}

export const loader = {
  workspace: async ({ params }: LoaderFunctionArgs) => {
    const { ownerShip, workspaceId } = params as WorkspacePageParams
    const res = await getWorkspaceWithProjects(ownerShip, workspaceId)
    return res
  },
  invitation: async () => {
    const res = await getInvitedProjects()
    return res
  },
  recycleBin: async ({ params }: LoaderFunctionArgs) => {
    const { projectId } = params as ProjectPageParams
    const res = await getRecycleBin(projectId)
    return res
  },
  projectView: async ({ params }: LoaderFunctionArgs) => {
    const { projectId, viewMode } = params as ProjectPageParams
    const res = await getProjectForDisplaying(projectId, viewMode ?? 'board')
    return res
  }
}

export default routeLinks
