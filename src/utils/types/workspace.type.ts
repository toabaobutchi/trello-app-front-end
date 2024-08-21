import { ProjectCardType } from './project.type'
import { OwnerInfo } from './user.type'

/** kiểu base */
export type Workspace = {
  id: number
  name: string
  createAt: number
  slug: string
  description: string
}

/** dùng cho sidebar (own và shared workspaces) */
export type WorkspaceResponse = Workspace & {
  ownerId: string
  context: string
}

/** model để tạo workspace */
export type CreateWorkspaceModel = {
  name: string
  description?: string
}

/** dùng để hiển thị cho trang workspace cụ thể */
export type WorkspaceResponseWithRelatedProjects = WorkspaceResponse &  {
  projects: ProjectCardType[]
  owner?: OwnerInfo
}

/** model cập nhật workspace */
export type WorkspaceUpdateModel = {
  name?: string
  description?: string
}
