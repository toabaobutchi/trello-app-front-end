import { JoinedTaskResponse } from "./task.type"

/** tải cùng với project card type */
export type AssignmentConfig = {
  assignmentId: string
  isPinned?: boolean
  lastViewAt?: number
  permission?: string
  projectId: string
}
/** lưu thông tin thành viên - sử dụng thường xuyên */
export type AssignmentResponse = {
  id: string
  userId: string
  displayName?: string
  projectId: string
  email: string
  avatar?: string
  permission?: string
}
/** dùng cho trang project member */
export type AssignmentProfileResponse = {
  id: string
  joinAt: number
  joinedTasks: JoinedTaskResponse[]
}
