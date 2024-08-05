import { http } from '@utils/Axios/HttpClientAuth'
import { CommentResponse, CreateCommentModel, ProjectCommentResponse } from '@utils/types'

const getCommentsInTask = async (taskId: string) => {
  const res = await http.get<CommentResponse[]>(`/comments/in-task/${taskId}`)
  return res
}

const sendComment = async (model: CreateCommentModel) => {
  const res = await http.post<CreateCommentModel, CommentResponse>('/comments', model)
  return res
}

const getCommentsInProject = async () => {
  const res = await http.get<ProjectCommentResponse[]>(`/comments/in-project`)
  return res
}

const sendProjectComment = async (content: string) => {
  const res = await http.post<{ content: string }, ProjectCommentResponse>('/comments/in-project', { content })
  return res
}

export { getCommentsInTask, sendComment, getCommentsInProject, sendProjectComment }
