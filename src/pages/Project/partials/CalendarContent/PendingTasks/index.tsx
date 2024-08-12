import { useMemo } from 'react'
import './PendingTasks.scss'
import { TaskResponseForBoard } from '@utils/types'
import CalendarTaskCard from '../CalendarTaskCard'

type PendingTasksProps = {
  tasks: TaskResponseForBoard[]
  date: moment.Moment
}

function PendingTasks({ tasks, date }: PendingTasksProps) {
  const pendingTasks = useMemo(() => {
    return tasks.filter(task => {
      const taskStartDate = task.startedAt
      if (taskStartDate) {
        const isPending =
          taskStartDate <= date.endOf('week').valueOf() && taskStartDate >= date.startOf('week').valueOf()
        return isPending
      }
      return false
    })
  }, [tasks, date])
  return (
    <div className='calendar-content-pending-tasks'>
      {pendingTasks?.map(t => (
        <CalendarTaskCard key={t.id} task={t} />
      ))}
      {!pendingTasks?.length && <p className='text-success'>No task is pending in week</p>}
    </div>
  )
}

export default PendingTasks
