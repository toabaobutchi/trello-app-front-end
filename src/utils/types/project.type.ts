import { AssignmentConfig } from './assignment.type'
import { ListResponseForBoard } from './list.type'
import { TaskResponseForTable } from './task.type'

/** lớp project base */
export type Project = {
  id: string
  description?: string
  name: string
  createdAt: number
  slug: string
  workspaceId: number
  color?: string
  dueDate?: number
}

/** dùng cho project card - tải cùng với workspace và hiển thị trong trang workspace cụ thể */
export type ProjectCardType = Project & {
  memberCount: number
  context: string
  assignmentConfig: AssignmentConfig
}

/** repsponse sau khi tạo project */
export type CreateProjectResponse = Project & {
  context: string
}

export type ProjectResponseForBoard = {
  id: string
  name: string
  color?: string
  createdAt: number
  dueDate?: number
  slug?: string
  workspaceId: string
  context: string
  listOrder?: string
  assignmentId: string
  lists?: ListResponseForBoard[]
}

export type CreateProjectModel = {
  name: string
  color?: string
  workspaceId: number | string // xử lý convert
  description?: string
  dueDate?: number
  listOrder?: string // JSON string
}

export type ProjectResponseForTable = {
  id: string
  name: string
  color?: string
  createdAt: number
  dueDate?: number
  context: string
  tasks?: TaskResponseForTable[]
}

export type ProjectResponseForUpdating = {
  name: string
  description?: string
  dueDate?: number
  color?: string
  minimunAllowedDueDate?: number
}

export type UpdateProjectModel = {
  name: string
  description?: string
  dueDate?: number
  color?: string
}

export type UpdateProjectResponse = {
  id: string
  name: string
  description?: string
  dueDate?: number
  color?: string
}

export type ProjectResponse = {
  id: string
  name: string
  description?: string
  createdAt: number
  dueDate?: number
  context?: string
  color?: string
  workspaceId: string
  slug: string
  listOrder?: string
}

export type JoinTaskResponse = {
  taskId: string
  assignmentId: string
  assignerId: string
  assignedAt: number
}

export type InvitedProjectResponse = {
  id: string
  name: string
  createdAt: number
  dueDate?: number
  color?: string
  description?: string
  invitedPermission: string
  inviterEmail: string
  invitedAt: number
  invitationId: string
  slug: string
}

export type ProjectDataInput = {
  name: string
  useColor: boolean
  color?: string
  description?: string
  dueDate?: number
  minimunAllowedDueDate?: number
}

export type BoardDataInput = {
  title: string
  useColor: boolean
  color: string
  selectedWorkspace: string
  description?: string
  dueDate?: string
}