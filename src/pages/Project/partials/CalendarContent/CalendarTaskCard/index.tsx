import { TaskResponseForBoard } from '@utils/types'
import './CalendarTaskCard.scss'

type CalendarTaskCardProps = {
  task: TaskResponseForBoard
}

function CalendarTaskCard({ task }: CalendarTaskCardProps) {
  return (
    <div className={`calendar-task-card calendar-task-card__${task.priority?.toLowerCase() || 'default'}`}>
      <p className='calendar-task-card-name'>{task.name}</p>
    </div>
  )
}

export default CalendarTaskCard
