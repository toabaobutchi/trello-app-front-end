import { getChangeLogs } from '@services/changelog.services'
import { getInvitedProjects } from '@services/invitation.services'
import { getProjectForDisplaying } from '@services/project.services'
import { getRecycleBin } from '@services/task.services'
import { getWorkspaceWithProjects, loadWorkspaces } from '@services/workspace.services'
import { getSlug } from '@utils/functions'
import { ProjectPageParams, WorkspacePageParams } from '@utils/types/page-params.type'
import { parseInt } from 'lodash'
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
    changeLog: 'change-logs',
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
    return `/projects/${ownerShip.toLowerCase()}/${getSlug(slug)}/${projectId}/v/${viewMode}`
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
  },
  changeLog(routeParams: ProjectPageParams) {
    const { ownerShip, projectId, slug } = routeParams
    return `/projects/${ownerShip}/${getSlug(slug)}/${projectId}/${routeLinks.project.changeLog}`
  }
}

export const loader = {
  layoutLoader: async () => {
    const res = await loadWorkspaces()
    return res
  },
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
  },
  changeLogs: async ({ params, request }: LoaderFunctionArgs) => {
    const url = request.url
    const urlObj = new URL(url)
    const queryParams = new URLSearchParams(urlObj.search)
    const page = parseInt(queryParams.get('p') ?? '1')
    let uid = queryParams.get('uid')
    const date = queryParams.get('d')
    let task = queryParams.get('task')

    if (uid && uid === 'all') {
      uid = null
    }

    if (task && task === 'all') {
      task = null
    }

    const { projectId } = params as ProjectPageParams
    const res = await getChangeLogs(
      projectId,
      date ? parseInt(date) : undefined,
      uid ?? undefined,
      task ?? undefined,
      page
    )
    return res
  }
}

export default routeLinks
