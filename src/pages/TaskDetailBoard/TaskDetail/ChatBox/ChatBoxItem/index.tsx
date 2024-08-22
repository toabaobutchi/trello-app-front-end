import Flex from '@comps/StyledComponents/Flex'
import { useProjectSelector } from '@hooks/useProjectSelector'
import { getCommentTime } from '@utils/functions'
import { CommentResponse } from '@utils/types/comment.type'
import { useEffect, useState } from 'react'

function ChatBoxItem({ comment }: { comment: CommentResponse }) {
  const { members } = useProjectSelector()
  const [commentor] = useState(() => members.find(m => m.id === comment?.assignmentId))
  const [commentTime, setCommentTime] = useState<{ diff: number; unit: string }>()
  useEffect(() => {
    const commentTime = getCommentTime(comment.commentAt)
    setCommentTime(commentTime)
    let timer = 0
    // ngừng lại khi vượt quá 14 ngày
    if (commentTime.diff < 14 && commentTime.unit.toLowerCase() === 'day') {
      let reCalculateTime = 0
      if (commentTime.unit.toLowerCase() === 'day') {
        reCalculateTime = 60000 * 24
      } else if (commentTime.unit.toLowerCase() === 'hour') {
        reCalculateTime = 60000 * 60
      } else {
        reCalculateTime = 60000
      }
      timer = setInterval(() => {
        setCommentTime(getCommentTime(comment.commentAt))
      }, reCalculateTime)
    }

    return () => {
      if (timer) clearInterval(timer)
    }
  }, [])
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
          <p className='chat-box-content-item-info-time'>
            {commentTime?.diff}
            {commentTime?.unit.charAt(0)} ago
          </p>
        </div>
        <div className='chat-box-content-item-comment'>
          <p>{comment.content}</p>
        </div>
      </div>
    </>
  )
}

export default ChatBoxItem
