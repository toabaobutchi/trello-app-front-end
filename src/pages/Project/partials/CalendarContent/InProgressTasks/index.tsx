import Flex from '@comps/StyledComponents'
import SwitchButton from '@comps/SwitchButton'
import './InProgressTasks.scss'
import { TaskResponseForBoard } from '@utils/types'
import { useMemo } from 'react'
import CalendarTaskCard from '../CalendarTaskCard'

type InProgressTasksProps = {
  tasks: TaskResponseForBoard[]
  date: moment.Moment
}

function InProgressTasks({ tasks, date }: InProgressTasksProps) {
  const inProgressTasks = useMemo(() => {
    return tasks.filter(task => {
      const taskDueDate = task.dueDate
      const taskStartDate = task.startedAt
      let isStarted = true
      if (taskStartDate) {
        // ngày bắt đầu đã qua
        isStarted = taskStartDate < date.startOf('week').valueOf()
      }
      if (taskDueDate) {
        // ngày đến hạn không đến trong tuần đang chọn
        const isInWeek = taskDueDate > date.endOf('week').valueOf()
        return isStarted && isInWeek
      }
      return true && isStarted
    })
  }, [tasks, date])
  return (
    <>
      {/* <div className='calendar-content-in-progress-filters'>
        <Flex $alignItem='center' $gap='0.5rem'>
          <SwitchButton
            inputAttributes={{
              id: 'only-have-due-date',
              type: 'checkbox'
            }}
          />
          <label className='cpointer' htmlFor='only-have-due-date'>
            Only tasks having due date
          </label>
        </Flex>
        <Flex $alignItem='center' $gap='0.5rem'>
          <SwitchButton
            inputAttributes={{
              id: 'only-no-due-date',
              type: 'checkbox'
            }}
          />
          <label className='cpointer' htmlFor='only-no-due-date'>
            Only tasks with no due date
          </label>
        </Flex>
      </div> */}
      <div className='calendar-content-in-progress'>
        {inProgressTasks.map(t => (
          <CalendarTaskCard key={t.id} task={t} />
        ))}
        {!inProgressTasks?.length && <p className='text-success'>No task is in progress in week</p>}
      </div>
    </>
  )
}

export default InProgressTasks
