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
