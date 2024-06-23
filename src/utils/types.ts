export interface CustomizablePropType {
  content?: React.ReactNode
  style?: React.CSSProperties
  className?: string
  customHtmlAttributes?: object
}

export type ThemeType =
  | 'success'
  | 'warning'
  | 'danger'
  | 'primary'
  | 'info'
  | 'light'
  | 'secondary'
  | 'dark'
  | 'default'

export interface AccountType {
  id: string
  displayName: string
  avatar?: string
  email: string
  exp?: number
}

export interface ToastOptionsType {
  delay?: number
  floatDuration?: number
  fadeOutDuration?: number
  removeAfterDelay?: number
}

export interface ToastType {
  icon?: React.ReactNode
  closeIcon?: React.ReactNode
  title?: React.ReactNode
  content?: React.ReactNode
  type?: 'success' | 'error' | 'warning' | 'info'
  options?: ToastOptionsType
}

export type Workspace = {
  id: number
  name: string
  createAt: number
  slug: string
  description: string
  projects?: Project[]
}

export type WorkspaceResponse = {
  id: number
  name: string
  description?: string
  slug: string
  createdAt: number
  ownerId: string
  context: string
}
// dùng cho load trang workspace
export type WorkspaceResponseWithRelatedProjects = {
  id: number
  name: string
  description?: string
  slug: string
  createdAt: number
  ownerId: string
  context: string
  projects: LoadedProjectWithWorkspace[]
}

export type LoadedProjectWithWorkspace = {
  id: string
  name: string
  slug: string
  color?: string
  description?: string
  createdAt: number
  memberCount: number
  dueDate?: number
  context: string
}

export type CreateWorkspaceModel = {
  name: string
  description?: string
}

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

export type LoginInfo = {
  accessToken: string
  accountInfo: AccountType
}

export type InputChange = React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>

export type ProjectPageParams = {
  ownerShip: string | OwnerShipType
  projectId: string
  slug: string
  viewMode?: string | ProjectViewMode
}

export type WorkspacePageParams = {
  ownerShip: string | OwnerShipType
  workspaceId: string
  slug: string
}
export type OwnerShipType = 'owner' | 'admin' | 'member' | 'observer'
export type ProjectViewMode = 'board' | 'table' | 'chart' | 'calendar'

export type TaskResponseForBoard = {
  id: string
  name: string
  description?: string
  isCompleted?: boolean
  dueDate?: number
  priority?: string
  listId: number
  assigneeCount: number
  completedSubTaskCount?: number
  subTaskCount?: number
}

export type ListResponseForBoard = {
  id: number
  name: string
  index: number
  updatedAt?: number
  projectId: string
  tasks?: TaskResponseForBoard[]
}

export type ProjectResponseForBoard = {
  id: string
  name: string
  color?: string
  createdAt: number
  dueDate?: number
  workspaceId: string
  context: string
  memberCount?: number
  lists?: ListResponseForBoard[]
}

export type CreateProjectModel = {
  name: string
  color?: string
  workspaceId: number | string // xử lý convert
  description?: string
  dueDate?: number
}

export type SelectListItem = {
  value: string
  display?: string
}
