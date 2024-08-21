import { AssignmentResponse, ChangeLogResponse } from '@utils/types'
import './ChangeLogItem.scss'
import { useEffect, useState } from 'react'
import { useProjectSelector } from '@hooks/useProjectSelector'
import { getDateString } from '@utils/functions'
import { NavLink } from 'react-router-dom'
import { linkCreator } from '@routes/router'
import { ProjectPageParams } from '@utils/types/page-params.type'
import { usePageParams } from '@hooks/usePageParams'

type ChangeLogItemProps = {
  changeLog: ChangeLogResponse
}

function ChangeLogItem({ changeLog }: ChangeLogItemProps) {
  const [assignment, setAssignment] = useState<AssignmentResponse>()
  const { members } = useProjectSelector()
  const params = usePageParams<ProjectPageParams>()
  useEffect(() => {
    setAssignment(members.find(a => a.id === changeLog.assignmentId))
  }, [members, changeLog.assignmentId])
  const link = () => {
    const entityType = changeLog.log.entityType
    const entityId = changeLog.log.entityId
    switch (entityType) {
      case 'Task':
        return `task/${entityId}`
      default:
        return linkCreator.project({ ...params, viewMode: 'board' })
    }
  }
  return (
    <>
      <div className='change-log-item row jcsb gap-2'>
        <div
          className={`change-log-item-action-type change-log-item-action-type__${changeLog.log.logAction.toLowerCase()}`}
        >
          {changeLog.log.logAction}
        </div>
        <div className='change-log-item-detail'>
          <p className='change-log-item-detail-issue-date'>{getDateString(new Date(changeLog.createdAt), true)}</p>
          <NavLink
            to={link()}
            className='change-log-item-detail-log'
            dangerouslySetInnerHTML={{ __html: changeLog.log.detailLog as string }}
          ></NavLink>
          <p className='change-log-item-detail-assignment-info row gap-1'>
            <img src={assignment?.avatar} alt='avatar' />
            <NavLink
              to={linkCreator.projectMember(params, assignment?.id)}
              className='change-log-item-detail-assignment-info-email'
            >
              {assignment?.email}
            </NavLink>
          </p>
        </div>
      </div>
    </>
  )
}

export default ChangeLogItem
