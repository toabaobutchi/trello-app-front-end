function ChatBoxItem() {
  return (
    <>
      <div className='chat-box-content-item'>
        <div className='chat-box-content-item-info'>
          <span className='chat-box-content-item-info-avatar'>
            <img src='https://cdn.pixabay.com/photo/2021/02/27/16/25/woman-6055084_1280.jpg' alt='avatar' />
          </span>
          <p className='chat-box-content-item-info-display-name'>Hoài An</p>
          <p className='chat-box-content-item-info-time'>3 minutes ago</p>
        </div>
        <div className='chat-box-content-item-comment'>
          <p>Hello everyone! How are you doing today?</p>
        </div>
      </div>
    </>
  )
}

export default ChatBoxItem
