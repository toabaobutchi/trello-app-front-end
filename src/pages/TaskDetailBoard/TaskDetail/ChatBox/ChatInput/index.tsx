import { useState } from 'react'
import './ChatInput.scss'
import { InputChange } from '@utils/types'

function ChatInput({ onComment }: { onComment?: (comment: string) => void }) {
  const [comment, setComment] = useState('')
  const handleChange = (e: InputChange) => {
    setComment(e.target.value)
  }
  const handleSubmit = () => {
    if (comment && onComment) {
      onComment(comment)
      setComment('')
    }
  }
  return (
    <>
      <div className='chat-input'>
        <input type='text' placeholder='Type a comment...' value={comment} onChange={handleChange} />
        <button onClick={handleSubmit}>
          <i className='fa-solid fa-paper-plane'></i> Send
        </button>
      </div>
    </>
  )
}

export default ChatInput
