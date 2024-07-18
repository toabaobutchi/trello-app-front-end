import { useContext, useEffect, useState } from 'react'
import './ChatBox.scss'
import ChatBoxItem from './ChatBoxItem'
import ChatInput from './ChatInput'
import { CommentResponse, CreateCommentModel } from '@utils/types'
import HttpClient from '@utils/HttpClient'
import { useSelector } from 'react-redux'
import { RootState } from '@redux/store'
import { TaskDetailContext, TaskDetailContextType } from '@pages/TaskDetailBoard/context'
import { hubs, ProjectHub } from '@utils/Hubs'

const http = new HttpClient()

function ChatBox() {
  const [comments, setComments] = useState<CommentResponse[]>([])
  const context = useContext(TaskDetailContext)
  const { task } = context as TaskDetailContextType
  const members = useSelector((state: RootState) => state.project.activeProject.members)
  const account = useSelector((state: RootState) => state.login.accountInfo)
  const [assignment] = useState(members?.find(m => m.userId === account.id))

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
      http.getAuth(`/comments/in-task/${task?.id}`).then(res => {
        if (res?.status === 200) {
          setComments(_prev => res.data)
        } else console.log('Fail: ', res?.message)
      })
  }, [task?.id])

  const handleComment = async (comment: string) => {
    const commentModel: CreateCommentModel = {
      content: comment,
      taskId: task?.id as string,
      assignmentId: assignment?.id as string
    }
    const res = await http.postAuth('/comments', commentModel)
    if (res?.status === 200) {
      setComments(prev => [...prev, res?.data])

      if (projectHub.isConnected) {
        projectHub.connection?.invoke(hubs.project.send.comment, res?.data)
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
