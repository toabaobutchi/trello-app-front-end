import { http } from '@utils/Axios/HttpClientAuth'
import { AttachmentResponse, CreateAttachmentModel } from '@utils/types/attachment.type'

const getAttachmentsInTask = async (taskId: string) => {
  const res = await http.get<AttachmentResponse[]>(`/attachments/in-task/${taskId}`)
  return res
}

const addAttachment = async (model: CreateAttachmentModel) => {
  const res = await http.post<CreateAttachmentModel, AttachmentResponse>('/attachments', model)
  return res
}

export { getAttachmentsInTask, addAttachment }
