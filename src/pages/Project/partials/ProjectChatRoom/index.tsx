import { useState } from 'react'
import './ProjectChatRoom.scss'
import ProjectChatBody from './ProjectChatBody'

function ProjectChatRoom() {
  const [chatRoomExpanded, setChatRoomExpanded] = useState(false)
  // const [unreadComments, setUnreadComments] = useState(0)
  const handleToggleChatRoom = () => {
    setChatRoomExpanded(!chatRoomExpanded)
    // setUnreadComments(0)
  }
  // const [projectHub] = useState(new ProjectHub())
  // useEffect(() => {
  //   console.log(projectHub.isConnected)
  //   if (projectHub.isConnected) {
  //     if (!chatRoomExpanded) {
  //       projectHub.connection?.on(hubs.project.receive.projectComment, (_data: ProjectCommentResponse) => {
  //         setUnreadComments(prev => prev + 1)
  //       })
  //     } else {
  //       projectHub.connection?.off(hubs.project.receive.projectComment)
  //     }
  //   }
  // }, [projectHub.isConnected, chatRoomExpanded])
  return (
    <>
      <div className={`chat-room-toggle-buton`} onClick={handleToggleChatRoom}>
        <i className='fa-regular fa-comments'></i>
      </div>
      <div className={`chat-room-container ${chatRoomExpanded && 'expanded'}`}>
        <div className='chat-room-header row gap-2'>
          <div className='chat-room-header-close-btn' onClick={handleToggleChatRoom}>
            <i className='fa-solid fa-times'></i>
          </div>
          <span className='text-primary'>Chat room</span>
        </div>
        {chatRoomExpanded && <ProjectChatBody />}
      </div>
    </>
  )
}

export default ProjectChatRoom
