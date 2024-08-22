export type ChangeLogResponse = {
  id: number
  projectId: string
  assignmentId?: string
  createdAt: number
  log: LogDetail
}

export type LogDetail = {
  entityId: string | number
  detailLog?: string
  entityType: 'Project' | 'Task' | 'List' | 'Subtask' | 'Assignment' | 'Invitation' | 'TaskAssignment'
  logAction: 'Create' | 'Update' | 'Delete' | 'Join' | 'Unassign' | 'Assign'
}
