import { getCommentsInProject } from '@services/comment.services'
import { ProjectCommentResponse } from '@utils/types'
import { useEffect, useState } from 'react'
import ProjectChatItem from '../ProjectChatItem'
import ProjectChatSender from '../ProjectChatSender'
import { hubs, ProjectHub } from '@utils/Hubs'

function ProjectChatBody() {
  const [comments, setComments] = useState<ProjectCommentResponse[]>([])
  const [projectHub] = useState(new ProjectHub())
  useEffect(() => {
    getCommentsInProject().then(res => {
      if (res?.isSuccess) {
        setComments(res.data)
      }
    })
  }, [])
  useEffect(() => {
    if (projectHub.isConnected) {
      projectHub.connection?.on(hubs.project.receive.projectComment, (comment: ProjectCommentResponse) => {
        setComments(prev => [...prev, comment])
      })
    }
  }, [projectHub.isConnected])
  const handleUpdateComment = (comment: ProjectCommentResponse) => {
    setComments(prev => [...prev, comment])

    // send comment to hub
    if (projectHub.isConnected) {
      projectHub.connection?.invoke(hubs.project.send.projectComment, comment)
    }
  }

  return (
    <>
      <div className='chat-room-body'>
        <div className='chat-room-body-main'>
          {comments.map(comment => (
            <ProjectChatItem key={comment.id} comment={comment} />
          ))}
        </div>
        <ProjectChatSender updateChat={handleUpdateComment} />
      </div>
    </>
  )
}

export default ProjectChatBody
