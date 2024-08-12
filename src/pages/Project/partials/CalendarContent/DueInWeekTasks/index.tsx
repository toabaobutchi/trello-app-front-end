import { TaskResponseForBoard } from '@utils/types'
import './DueInWeekTasks.scss'
import { useMemo } from 'react'
import CalendarTaskCard from '../CalendarTaskCard'

type DueInWeekTasksProps = {
  tasks: TaskResponseForBoard[]
  date: moment.Moment
}

function DueInWeekTasks({ tasks, date }: DueInWeekTasksProps) {
  const dueTasks = useMemo(() => {
    return tasks.filter(task => {
      const taskDueDate = task.dueDate
      if (taskDueDate) {
        const isInWeek = taskDueDate <= date.endOf('week').valueOf() && taskDueDate >= date.startOf('week').valueOf()
        return isInWeek
      }
      return false
    })
  }, [tasks, date])
  return (
    <div className='calendar-content-due-tasks'>
      {dueTasks?.map(t => (
        <CalendarTaskCard key={t.id} task={t} />
      ))}
      {!dueTasks?.length && <p className='text-success'>No task is due in week</p>}
    </div>
  )
}

export default DueInWeekTasks
