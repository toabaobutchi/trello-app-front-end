import { http } from '@utils/Axios/HttpClientAuth'
import { CommentResponse, CreateCommentModel } from '@utils/types'

const getCommentsInTask = async (taskId: string) => {
  const res = await http.get<CommentResponse[]>(`/comments/in-task/${taskId}`)
  return res
}

const sendComment = async (model: CreateCommentModel) => {
  const res = await http.post<CreateCommentModel, CommentResponse>('/comments', model)
  return res
}

export { getCommentsInTask, sendComment }
