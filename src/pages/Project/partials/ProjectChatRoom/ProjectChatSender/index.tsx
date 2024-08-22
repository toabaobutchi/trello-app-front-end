import { sendProjectComment } from '@services/comment.services'
import { handleTriggerKeyPress } from '@utils/functions'
import { ProjectCommentResponse } from '@utils/types/comment.type'
import { useState } from 'react'

function ProjectChatSender({ updateChat = () => {} }: { updateChat?: (response: ProjectCommentResponse) => void }) {
  const [comment, setComment] = useState('')
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => setComment(e.target.value)
  const handleSendComment = async () => {
    if (comment.trim() !== '') {
      // Send comment to the server or Redux state
      const res = await sendProjectComment(comment)
      if (res?.isSuccess) {
        // update chat room
        updateChat(res?.data)

        // send data to hub
        // ...
      }
      setComment('')
    }
  }
  const triggerEnter = handleTriggerKeyPress(() => {
    handleSendComment()
  }, 'Enter')
  return (
    <>
      <div className='chat-room-sender'>
        <input
          onChange={handleChange}
          value={comment}
          type='text'
          className='chat-room-sender-input'
          autoFocus
          placeholder='Type your message here...'
          onKeyDown={triggerEnter.handler}
        />
        <button onClick={handleSendComment} className='chat-room-sender-btn'>
          <i className='fa-regular fa-paper-plane'></i>
        </button>
      </div>
    </>
  )
}

export default ProjectChatSender
