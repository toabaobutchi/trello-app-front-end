export type AttachmentResponse = {
  id: number
  displayText?: string
  link: string
  createdAt: number
  taskId: string
  assignmentId: string
}

export type CreateAttachmentModel = {
  link: string
  displayText: string
  taskId: string
  assignmentId: string
}