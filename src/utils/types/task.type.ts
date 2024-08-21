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
