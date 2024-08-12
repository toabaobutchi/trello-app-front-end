import { TaskResponseForBoard } from '@utils/types'
import './CalendarTaskCard.scss'
import PriorityTag from '@comps/TaskCard/PriorityTag'
import { getDateString } from '@utils/functions'
import { NavLink } from 'react-router-dom'

type CalendarTaskCardProps = {
  task: TaskResponseForBoard
}

function CalendarTaskCard({ task }: CalendarTaskCardProps) {
  return (
    <div className={`calendar-task-card calendar-task-card__${task.priority?.toLowerCase() || 'default'}`}>
      <PriorityTag priority={task.priority} />
      <NavLink to={`task/${task.id}`} className='calendar-task-card-name'>
        {task.name}
      </NavLink>
      <div className='calendar-task-card-body'>
        <p className='calendar-task-card-body-start-date'>
          <b>Start date:</b>{' '}
          {task.startedAt ? getDateString(new Date(task.startedAt)) : <span className='text-light'>[ Not set ]</span>}
        </p>
        <p className='calendar-task-card-body-due-date'>
          <b>Due date:</b>{' '}
          {task.dueDate ? getDateString(new Date(task.dueDate)) : <span className='text-light'>[ Not set ]</span>}
        </p>
      </div>
    </div>
  )
}

export default CalendarTaskCard
