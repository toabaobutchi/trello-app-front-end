import { RelatedTaskResponse } from '@utils/types'
import './RelatedTaskItem.scss'
import Flex from '@comps/StyledComponents'
import { getDateString } from '@utils/functions'
import Button from '@comps/Button'
import Tooltip from '@comps/Tooltip-v2'
import { NavLink } from 'react-router-dom'

type RelatedTaskItemProps = {
  task: RelatedTaskResponse
}

function RelatedTaskItem({ task }: RelatedTaskItemProps) {
  return (
    <>
      <div
        className={`related-tasks-item related-tasks-item__${task.priority?.toLowerCase() || 'default'}`}
        key={task.id}
      >
        <div className='related-tasks-item-info'>
          <Flex $alignItem='center' $gap='0.5rem' style={{ marginBottom: '0.2rem' }}>
            <NavLink to={`../task/${task.id}`} className='related-tasks-item-info-name'>
              {task.name}
            </NavLink>
            <div
              className={`related-tasks-item-info-priority related-tasks-item-info-priority__${
                task.priority?.toLowerCase() || 'default'
              }`}
            >
              {task.priority ? task.priority + ' Priority' : 'Priority not set'}
            </div>
          </Flex>
          <Flex $flexDirection='column'>
            <div className='related-tasks-item-info-start-date'>
              <i className='fa-regular fa-calendar'></i> Start date:{' '}
              {task.startedAt ? (
                getDateString(new Date(task.startedAt))
              ) : (
                <span className='text-secondary'>[Not set]</span>
              )}
            </div>
            <div className='related-tasks-item-info-due-date'>
              <i className='fa-regular fa-clock'></i> Due date:{' '}
              {task.dueDate ? getDateString(new Date(task.dueDate)) : <span className='text-secondary'>[Not set]</span>}
            </div>
          </Flex>
        </div>
        <div className='related-tasks-item-actions'>
          {Boolean(task.dueDate) && (
            <Tooltip position='top' arrow content='Set as start date'>
              <Button variant='text' className='set-start-date-btn'>
                <i className='fa-solid fa-wrench'></i>
              </Button>
            </Tooltip>
          )}
          <Tooltip position='top' arrow content='Remove this task'>
            <Button variant='text' theme='danger' className='delete-related-task-btn'>
              <i className='fa-regular fa-trash-can'></i>
            </Button>
          </Tooltip>
        </div>
      </div>
    </>
  )
}

export default RelatedTaskItem
