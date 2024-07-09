import Flex from '@comps/StyledComponents/Flex'
import { RootState } from '@redux/store'
import { CommentResponse } from '@utils/types'
import { useState } from 'react'
import { useSelector } from 'react-redux'

function ChatBoxItem({ comment }: { comment: CommentResponse }) {
  const members = useSelector((state: RootState) => state.project.activeProject.members)
  const [commentor] = useState(() => members.find(m => m.id === comment?.assignmentId))
  const [commentTime] = useState(() => {
    const commentDate = new Date(comment.commentAt)
    const currentDate = new Date()
    const diffTime = currentDate.getTime() - commentDate.getTime()
    const diffMinutes = Math.floor(diffTime / (1000 * 60))
    if (diffMinutes < 60) return `${diffMinutes}m ago`
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
    return diffDays > 0 ? `${diffDays}d ago` : `${Math.floor(diffTime / (1000 * 60 * 60))}h ago`
  })
  return (
    <>
      <div className='chat-box-content-item'>
        <div className='chat-box-content-item-info'>
          <Flex $alignItem='center' $gap='0.5rem'>
            <span className='chat-box-content-item-info-avatar'>
              <img src={commentor?.avatar} alt='avatar' />
            </span>
            <p className='chat-box-content-item-info-display-name'>{commentor?.displayName}</p>
          </Flex>
          <p className='chat-box-content-item-info-time'>{commentTime}</p>
        </div>
        <div className='chat-box-content-item-comment'>
          <p>{comment.content}</p>
        </div>
      </div>
    </>
  )
}

export default ChatBoxItem
