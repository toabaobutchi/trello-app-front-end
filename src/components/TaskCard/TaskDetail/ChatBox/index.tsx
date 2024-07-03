import { useContext, useEffect, useState } from 'react'
import './ChatBox.scss'
import ChatBoxItem from './ChatBoxItem'
import ChatInput from './ChatInput'
import { CommentResponse, CreateCommentModel } from '@utils/types'
import HttpClient from '@utils/HttpClient'
import { TaskDetailContext } from '@comps/TaskCard'
import { useSelector } from 'react-redux'
import { RootState } from '@redux/store'
import { useHub } from '@hooks/useHub'

const http = new HttpClient()

function ChatBox() {
  const [comments, setComments] = useState<CommentResponse[]>([])
  const task = useContext(TaskDetailContext)
  const members = useSelector((state: RootState) => state.project.activeProject.members)
  const account = useSelector((state: RootState) => state.login.accountInfo)
  const [assignment] = useState(members?.find(m => m.userId === account.id))
  const connection = useHub(
    '/taskHub',
    'SubscribeTaskGroup',
    task?.state?.taskDetail?.id as unknown as object,
    assignment?.id as unknown as object
  )

  useEffect(() => {
    // Fetch comments from API
    http.getAuth(`/comments/in-task/${task?.state?.taskDetail?.id}`).then(res => {
      if (res?.status === 200) {
        setComments(res.data)
      } else console.log('Fail: ', res?.message)
    })
  }, [task?.state?.taskDetail?.id])

  useEffect(() => {
    if (connection) {
      connection.on('RecieveComment', (commentResponse: CommentResponse) => {
        setComments(prev => [...prev, commentResponse])
      })
    }
  }, [connection])

  const handleComment = async (comment: string) => {
    const commentModel: CreateCommentModel = {
      content: comment,
      taskId: task?.state?.taskDetail?.id as string,
      assignmentId: assignment?.id as string
    }
    const res = await http.postAuth('/comments', commentModel)
    if (res?.status === 200) {
      setComments(prev => [...prev, res?.data])
      if (connection) {
        connection.invoke('SendComment', res?.data)
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
