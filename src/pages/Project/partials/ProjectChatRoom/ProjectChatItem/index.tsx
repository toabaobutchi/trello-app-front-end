import { ProjectCommentResponse } from '@utils/types'
import './ProjectChatItem.scss'

function ProjectChatItem({ comment }: { comment: ProjectCommentResponse }) {
  return (
    <>
      <div className='project-chat-item'>{comment.content}</div>
    </>
  )
}

export default ProjectChatItem
