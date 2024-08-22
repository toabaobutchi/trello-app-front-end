export type ProjectCommentResponse = {
  id: string
  content: string
  commentAt: number
  projectId: string
  assignmentId?: string
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