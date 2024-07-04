export interface CustomizablePropType {
  content?: React.ReactNode
  style?: React.CSSProperties
  className?: string
  customHtmlAttributes?: object
}

export type ThemeType = 'success' | 'warning' | 'danger' | 'primary' | 'info' | 'light' | 'secondary' | 'dark' | 'default'

export type SubtaskForBoard = {
  id: number
  title: string
  taskId: string
  isCompleted?: boolean
  assignmentId?: string
}

export type AssignmentResponse = {
  id: string
  userId: string
  displayName?: string
  projectId: string
  email: string
  avatar?: string
  permission?: string
}

export type TaskDetailForBoard = {
  id: string
  name: string
  isMarkedNeedHelp?: boolean
  priority: string
  description?: string
  listId: string
  listName: string
  dueDate?: number
  attachmentsCount: number
  creatorId?: string // assignment id
  taskAssignmentIds?: string[]
  subTasks?: SubtaskForBoard[]
}

export interface AccountType {
  id: string
  displayName: string
  avatar?: string
  email: string
  exp?: number
}

export type CreateListResponse = {
  createdList: ListResponseForBoard
  listOrder?: string
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

export type CreateListModel = {
  name: string
  projectId: string
}

export type CreateTaskModel = {
  name: string
  listId: string
}

export type ChangeTaskOrderModel = {
  oldListId: string
  newListId: string
  newTaskOrder: string
  oldTaskOrder: string
}

export type AttachmentResponse = {
  id: number
  displayText?: string
  link: string
  createdAt: number
  taskId: string
  assignmentId: string
}

export type CommentResponse = {
  id: number
  content: string
  commentAt: number
  taskId: string
  assignmentId: string
}

export type CreateCommentModel = {
  taskId: string
  assignmentId: string
  content: string
}

export type CreateAttachmentModel = {
  link: string
  displayText: string
  taskId: string
  assignmentId: string
}

export type ChangeTaskOrderResponse = {
  updatedOldListId: string
  updatedNewListId: string
  updatedNewTaskOrder: string
  updatedOldTaskOrder: string
}

export type DragOverResult = {
  overList?: ListResponseForBoard
  activeList: ListResponseForBoard
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

export type ProjectContextResponse = {
  id: string
  description?: string
  name: string
  createdAt: number
  slug: string
  workspaceId: number
  color?: string
  dueDate?: number
  context: string
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

export interface ResponseForBoard {
  id: string
}

export interface TaskResponseForBoard extends ResponseForBoard {
  name: string
  description?: string
  isCompleted?: boolean
  createdAt: number
  dueDate?: number
  priority?: string
  listId: string
  assigneeCount: number
  completedSubTaskCount?: number
  subTaskCount?: number
}

export interface ListResponseForBoard extends ResponseForBoard {
  name: string
  createdAt: number
  projectId: string
  taskOrder?: string
  tasks?: TaskResponseForBoard[]
}

export type CreateTaskResponse = {
  createdTask: TaskResponseForBoard
  taskOrder?: string
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
  memberCount?: number
  listOrder?: string
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

export type SelectListItem = {
  value: string
  display?: string
}

export type ListChangeResponse = {
  listId: string
  updatedIndex: number
  updatedAt: number
}


export type FilterType = {
  isFiltering?: boolean
  priorities?: SelectListItem[]
  members?: SelectListItem[]
  noAssigneesFilter?: boolean
  dueDate?: Date
  overDueFilter?: boolean
}