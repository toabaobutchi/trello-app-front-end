import './ChatBox.scss'
import ChatBoxItem from './ChatBoxItem'
import ChatInput from './ChatInput'

function ChatBox() {
  return (
    <>
      <div className='chat-box'>
        <div className='chat-box-content'>
          <ChatBoxItem />
          <ChatBoxItem />
          <ChatBoxItem />
          <ChatBoxItem />
          <ChatBoxItem />
          <ChatBoxItem />
          <ChatBoxItem />
          <ChatBoxItem />
          <ChatBoxItem />
          
        </div>
        <ChatInput />
      </div>
    </>
  )
}

export default ChatBox
