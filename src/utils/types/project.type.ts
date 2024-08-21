import { AssignmentConfig } from './assignment.type'

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

