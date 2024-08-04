import { useState } from 'react'
import './ProjectChatRoom.scss'
import { AssignmentResponse } from '@utils/types'

const assignments: AssignmentResponse[] = [
  {
    email: 'abc@gmail.com',
    avatar:
      'https://img.freepik.com/free-psd/3d-rendering-avatar_23-2150833560.jpg?size=338&ext=jpg&ga=GA1.1.2008272138.1722643200&semt=ais_hybrid',
    id: 'abc-project1',
    displayName: 'ABC',
    projectId: 'project1',
    permission: 'admin',
    userId: 'abc'
  },
  {
    email: 'def@gmail.com',
    avatar:
      'https://img.freepik.com/free-psd/3d-render-avatar-character_23-2150611750.jpg',
    id: 'def-project1',
    displayName: 'DEF',
    projectId: 'project1',
    permission: 'admin',
    userId: 'def'
  },
  {
    email: 'ghi@gmail.com',
    avatar:
      'https://img.freepik.com/free-psd/3d-render-avatar-character_23-2150611753.jpg',
    id: 'ghi-project1',
    displayName: 'ghi',
    projectId: 'project1',
    permission: 'admin',
    userId: 'ghi'
  },
  {
    email: 'jkl@gmail.com',
    avatar:
      'https://img.freepik.com/free-psd/3d-rendering-avatar_23-2150833562.jpg',
    id: 'jkl-project1',
    displayName: 'jkl',
    projectId: 'project1',
    permission: 'admin',
    userId: 'jkl'
  }
]

type Comment = {
  id: string
  assignmentId: string
  comment: string
  commentedAt: number
}

const comments: Comment[] = [
  {
    id: 'comment1',
    assignmentId: 'abc-project1',
    comment: 'Hello everyone 1!',
    commentedAt: 1633654120000
  },
  
  {
    id: 'comment2',
    assignmentId: 'def-project1',
    comment: 'Hello everyone 2!',
    commentedAt: 1633654120000
  },
  {
    id: 'comment1',
    assignmentId: 'ghi-project1',
    comment: 'Hello everyone! 3',
    commentedAt: 1633654120000
  },
  {
    id: 'comment1',
    assignmentId: 'jkl-project1',
    comment: 'Hello everyone! 4',
    commentedAt: 1633654120000
  },

]

function ProjectChatRoom() {
  const [chatRoomExpanded, setChatRoomExpanded] = useState(false)
  const handleToggleChatRoom = () => setChatRoomExpanded(!chatRoomExpanded)
  return (
    <>
      <div className='chat-room-toggle-buton' onClick={handleToggleChatRoom}>
        <i className='fa-regular fa-comments'></i>
      </div>

      <div className={`chat-room-container ${chatRoomExpanded && 'expanded'}`}>
        <div className='chat-room-header row gap-3'>
          <div className='chat-room-header-close-btn' onClick={handleToggleChatRoom}>
            <i className='fa-solid fa-times'></i>
          </div>
          <span className='text-primary'>Chat room</span>
        </div>
        
      </div>
    </>
  )
}

export default ProjectChatRoom
