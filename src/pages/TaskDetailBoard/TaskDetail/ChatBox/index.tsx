import { useContext, useEffect, useState } from 'react'
import './ChatBox.scss'
import ChatBoxItem from './ChatBoxItem'
import ChatInput from './ChatInput'
import { CommentResponse, CreateCommentModel } from '@utils/types/comment.type'
import { TaskDetailContext, TaskDetailContextType } from '@pages/TaskDetailBoard/context'
import { hubs, ProjectHub } from '@utils/Hubs'
import { getCommentsInTask, sendComment } from '@services/comment.services'
import { useProjectSelector } from '@hooks/useProjectSelector'

function ChatBox() {
  const [comments, setComments] = useState<CommentResponse[]>([])
  const context = useContext(TaskDetailContext)
  const { task } = context as TaskDetailContextType
  const { members, board } = useProjectSelector()
  const [assignment] = useState(members?.find(m => m.id === board.assignmentId))

  const [projectHub] = useState<ProjectHub>(new ProjectHub())
  useEffect(() => {
    if (projectHub.isConnected && task?.id) {
      projectHub.connection?.on(hubs.project.receive.comment, (commentResult: CommentResponse) => {
        if (commentResult.taskId === task.id) {
          setComments(prev => [...prev, commentResult])
        }
      })
    }
  }, [task?.id])

  useEffect(() => {
    // Fetch comments from API
    if (task?.id)
      getCommentsInTask(task.id).then(res => {
        if (res?.isSuccess) {
          setComments(_prev => res.data)
        } else console.log('Fail: ', res?.message)
      })
  }, [task?.id])

  const handleComment = async (comment: string) => {
    if (task?.id && assignment?.id) {
      const commentModel: CreateCommentModel = {
        content: comment,
        taskId: task.id,
        assignmentId: assignment.id
      }
      const res = await sendComment(commentModel)
      if (res?.isSuccess) {
        setComments(prev => [...prev, res.data])

        if (projectHub.isConnected) {
          projectHub.connection?.invoke(hubs.project.send.comment, res.data)
        }
      }
    }
  }
  return (
    <>
      <div className='chat-box'>
        {comments.length > 0 && (
          <div className='chat-box-content'>
            {comments.map(comment => (
              <ChatBoxItem key={comment.id} comment={comment} />
            ))}
          </div>
        )}
        <ChatInput onComment={handleComment} />
      </div>
    </>
  )
}

export default ChatBox
