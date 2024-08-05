import { ProjectCommentResponse, ProjectPageParams } from '@utils/types'
import './ProjectChatItem.scss'
import { useProjectSelector } from '@hooks/useProjectSelector'
import { useState } from 'react'
import { autoDetectLinks, getCommentTime } from '@utils/functions'
import Tooltip from '@comps/Tooltip-v2'
import { NavLink, useParams } from 'react-router-dom'
import { linkCreator } from '@routes/router'

function ProjectChatItem({ comment }: { comment: ProjectCommentResponse }) {
  const { members, board } = useProjectSelector()
  const [assignment] = useState(() => members.find(m => m.id === comment.assignmentId))
  const commentTime = getCommentTime(comment.commentAt)
  const params = useParams() as ProjectPageParams
  return (
    <>
      <div className={`project-chat-item${assignment?.id === board.assignmentId ? ' self-comment' : ''}`}>
        <img src={assignment?.avatar} alt='user-avatar' />
        <div className='project-chat-item-main'>
          <div className='project-chat-item-info'>
            <Tooltip content={assignment?.email} position='bottom' arrow>
              <NavLink to={linkCreator.projectMember(params, assignment?.id)} className='project-chat-item-user-name'>
                {assignment?.displayName}
              </NavLink>
            </Tooltip>
            <p
              className={`project-chat-item-user-permission project-chat-item-user-permission__${assignment?.permission?.toLowerCase()}`}
            >
              {assignment?.permission}
            </p>
            <p className='project-chat-item-comment-time'>{`${commentTime.diff}${commentTime.unit} ago`}</p>
          </div>
          <p
            className='project-chat-item-content'
            dangerouslySetInnerHTML={{ __html: autoDetectLinks(comment.content) }}
          ></p>
        </div>
      </div>
    </>
  )
}

export default ProjectChatItem
