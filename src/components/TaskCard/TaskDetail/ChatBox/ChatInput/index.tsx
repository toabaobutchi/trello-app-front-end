import './ChatInput.scss'

function ChatInput() {
  return (
    <>
      <div className='chat-input'>
        <input type='text' placeholder='Type a comment...' />
        <button>
          <i className='fa-solid fa-paper-plane'></i> Send
        </button>
      </div>
    </>
  )
}

export default ChatInput
