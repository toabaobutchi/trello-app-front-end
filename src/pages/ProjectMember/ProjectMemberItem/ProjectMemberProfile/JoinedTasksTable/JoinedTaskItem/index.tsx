import Flex from '@comps/StyledComponents/Flex'
import { getDateString } from '@utils/functions'
import { JoinedTaskResponse } from '@utils/types'
import { NavLink } from 'react-router-dom'

function JoinedTaskItem({ task }: { task: JoinedTaskResponse }) {
  return (
    <>
      <div className='joined-task-item'>
        <Flex $alignItem='center' $justifyContent='space-between' $flexWrap='wrap' $gap='0.25rem' className='mb-1'>
          <NavLink
            to={`../task/${task.id}`}
            className={`joined-task-item-name row jcsb w-full ${
              'joined-task-item-name__' + task.priority?.toLowerCase()
            }`}
          >
            {task.name} <p className='priority-tag-text'>{'#' + (task.priority?.toLowerCase() || 'not-set')}</p>
          </NavLink>
          <Flex $alignItem='center' $gap='0.5rem' className='w-full'>
            {task.isCompleted && (
              <p className='joined-task-item-status joined-task-item__completed text-success row gap-1'>
                Completed <i className='fa-solid fa-check'></i>
              </p>
            )}
            {task.dueDate && task.dueDate * 1000 < Date.now() && (
              <p className='joined-task-item-status joined-task-item-duedate__overdue text-danger row gap-1'>
                Overdue <i className='fa-regular fa-calendar-xmark'></i>
              </p>
            )}
            {task.isMarkedNeedHelp && (
              <p className='joined-task-item-status joined-task-item__need-help text-warning row gap-1'>
                Need help <i className='fa-regular fa-circle-question'></i>
              </p>
            )}
          </Flex>
        </Flex>
        <Flex $alignItem='center' $gap='0.5rem' className='joined-task-item-duedate'>
          <i className='fa-regular fa-clock'></i> Duedate:&nbsp;
          {task?.dueDate ? (
            <>
              <p>{getDateString(new Date(task.dueDate * 1000))}</p>
            </>
          ) : (
            <>
              <span className='text-light'>[Not set]</span>
            </>
          )}
        </Flex>
        <p className='joined-task-item-join-time'>
          <i className='fa-solid fa-user-clock'></i> Joined at:&nbsp; {getDateString(new Date(task.assignedAt))}
        </p>
        <p className='joined-task-item-assignment-count'>
          <i className='fa-solid fa-users-between-lines'></i> Assignees:&nbsp; {task.assignmentCount}
        </p>
      </div>
    </>
  )
}

export default JoinedTaskItem
