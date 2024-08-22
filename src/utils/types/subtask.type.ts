
/** dùng để hiển thị trong task detail modal */
export type SubtaskForBoard = {
  id: number
  title: string
  taskId: string
  isCompleted?: boolean
  assignmentId?: string
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