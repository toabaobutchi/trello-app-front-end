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
  lastListUpdatedAt?: number
  attachmentsCount: number
  creatorId?: string // assignment id
  taskAssignmentIds?: string[]
  subTasks?: SubtaskForBoard[]
  isCompleted?: boolean
  isReOpened?: boolean
}

export type MarkedTaskResponse = {
  id: string
  listId: string
  isCompleted?: boolean
  isReOpened?: boolean
  isMarkedNeedHelp?: boolean
}

export interface AccountType {
  id: string
  displayName: string
  avatar?: string
  email: string
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
// export type WorkspaceResponseWithRelatedProjects = {
//   id: number
//   name: string
//   description?: string
//   slug: string
//   createdAt: number
//   ownerId: string
//   context: string
//   projects: LoadedProjectWithWorkspace[]
// }

// export type LoadedProjectWithWorkspace = {
//   id: string
//   name: string
//   slug: string
//   color?: string
//   description?: string
//   createdAt: number
//   memberCount: number
//   dueDate?: number
//   context: string
// }

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

export type ProjectMemberPageParams = {
  memberId?: string
} & Omit<ProjectPageParams, 'viewMode'>

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
  isReOpened?: boolean
  lastListUpdatedAt?: number
  taskAssignmentIds: string[]
  commentCount: number
  completedSubTaskCount?: number
  subTaskCount?: number
  isMarkedNeedHelp?: boolean
}

export type DeletedTaskResponse = {
  id: string
  listId: string
}

export interface TaskResponseForTable extends TaskResponseForBoard {
  listName: string
}

export interface ListResponseForBoard extends ResponseForBoard {
  name: string
  createdAt: number
  projectId: string
  taskOrder?: string
  wipLimit?: number
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

export type SelectListItem = {
  value: string
  display?: React.ReactNode
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
  dueDate?: number
  overDueFilter?: boolean
}

// export type TaskResponseForTable = {
//   id: string
//   name: string
//   description?: string
//   dueDate?: number
//   priority?: string
//   listId: string
//   listName: string
//   createdAt: number
//   taskAssignmentIds: string[]
//   isMarkedNeedHelp?: boolean
//   creatorId?: string
// }

export type ProjectResponseForTable = {
  id: string
  name: string
  color?: string
  createdAt: number
  dueDate?: number
  context: string
  tasks?: TaskResponseForTable[]
}

export type AssignmentConfig = {
  assignmentId: string
  isPinned?: boolean
  lastViewAt?: number
  permission?: string
  projectId: string
}
export type ProjectCardType = {
  id: string
  name: string
  slug: string
  color?: string
  description?: string
  workspaceId: string
  createdAt: number
  memberCount: number
  dueDate?: number
  context: string
  assignmentConfig: AssignmentConfig
}
export type OwnerInfo = {
  id: string
  displayName?: string
  email?: string
  avatar?: string
}

export type WorkspaceResponseWithRelatedProjects = {
  id: number
  name: string
  description?: string
  slug: string
  createdAt: number
  ownerId: string
  context: string
  projects: ProjectCardType[]
  owner?: OwnerInfo
}

export type ProjectResponseForUpdating = {
  name: string
  description?: string
  dueDate?: number
  color?: string
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

export type ProjectDataInput = {
  name: string
  useColor: boolean
  color?: string
  description?: string
  dueDate?: number
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

export type UpdatedListResponse = {
  id: string
  name?: string
  description?: string
  wipLimit?: number
}

export type UpdatedTaskResponse = {
  id: string
  listId: string
  name?: string
  description?: string
  dueDate?: number
  priority?: string
}

export type SubtaskResponse = {
  id: number
  title: string
  createdAt: number
  taskId: string
  isCompleted: boolean
  completedAt?: number
  assignmentId: string
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

export type Milisecond = number

export type JoinedTaskResponse = {
  id: string
  name: string
  isCompleted?: boolean
  priority?: string
  isMarkedNeedHelp?: boolean
  listId: string
  listName: string
  dueDate?: number
  assignedAt: number
  assignmentCount: number
}

export type AssignmentProfileResponse = {
  id: string
  joinAt: number
  joinedTasks: JoinedTaskResponse[]
}

export type JoinTaskResponse = {
  taskId: string
  assignmentId: string
  assignerId: string
  assignedAt: number
}

export type DeletedListResponse = {
  id: string
  name: string
  projectId: string
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

export type DeleterReponse = {
  id: string
  name: string
  email: string
  avatar?: string
}

export type InTrashTaskResponse = {
  id: string
  name: string
  description?: string
  deletedAt: number
  deleter?: DeleterReponse
}

export type AssignByTaskModel = {
  assignmentIds: string[]
}

export type AssignByTaskResponse = {
  taskId: string
  assignerId: string
} & AssignByTaskModel

export type User = {
  id: string
  email: string
  displayName?: string
  avatar?: string
}

export type AuthResponse = {
  accessToken: string
  user?: AccountType
}

export type WorkspaceUpdateModel = {
  name?: string
  description?: string
}

export type MarkTaskModel = {
  isCompleted?: boolean
  isMarkedNeedHelp?: boolean
  isReOpened?: boolean
}

export type UpdateTaskModel = {
  name?: string
  dueDate?: number
  priority?: string
  description?: string
}

export type UpdateListModel = {
  name?: string
  description?: string
  wipLimit?: number
}

export type AddSubtasksModel = {
  taskId: string
  names?: string[]
}

export type JoinSubtaskResponse = {
  id: number
  title: string
  taskId: string
  isCompleted: boolean
  completedAt?: number
  assignmentId: string
  assignedAt?: number
}

export type AssignSubtaskResponse = JoinSubtaskResponse & { assignerId?: string; isNewAssignment: boolean }

export type UnassignSubtaskResponse = {
  subtaskId: number
  taskId: string
  assignmentId?: string
}
