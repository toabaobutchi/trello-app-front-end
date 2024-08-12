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
      if (taskDueDate) {
        // ngày đến hạn không đến trong tuần đang chọn
        const isInWeek = taskDueDate > date.endOf('week').valueOf()
        return isInWeek
      }
      return true
    })
  }, [tasks, date])
  return (
    <>
      <div className='calendar-content-in-progress-filters'>
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
      </div>
      <div className='calendar-content-in-progress'>
        {inProgressTasks.map(t => (
          <CalendarTaskCard task={t} />
        ))}
      </div>
    </>
  )
}

export default InProgressTasks
