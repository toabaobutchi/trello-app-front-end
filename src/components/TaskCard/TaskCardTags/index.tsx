import { DateCompareState, isInToday, isOverdue } from '@utils/functions'
import { TaskResponseForBoard } from '@utils/types'
import './TaskCardTags.scss'

type TaskCardTagsProps = {
  task: TaskResponseForBoard
}

function TaskCardTags({ task }: TaskCardTagsProps) {
  return (
    <>
      <div className='task-card-body-tags row gap-1'>
        {isOverdue((task?.dueDate ?? 0) * 1000) === DateCompareState.DueSoon && (
          <p className='tag text-warning bg-warning'>
            <i className='fa-solid fa-hourglass-half'></i> Duesoon
          </p>
        )}
        {isOverdue((task?.dueDate ?? 0) * 1000) === DateCompareState.Overdue && (
          <p className='tag text-danger bg-danger'>
            <i className='fa-regular fa-calendar-xmark'></i> Overdue
          </p>
        )}
        {task?.isCompleted && (
          <p className='tag text-success bg-success'>
            <i className='fa-solid fa-check'></i> Completed
          </p>
        )}
        {task?.isMarkedNeedHelp && (
          <p className='tag text-purple bg-purple'>
            <i className='fa-regular fa-circle-question'></i> Need help
          </p>
        )}
        {isInToday(task.createdAt) && (
          <div className='tag text-danger bg-danger'>
            <i className='fa-solid fa-wand-magic-sparkles'></i> New today
          </div>
        )}
        {(task?.startedAt ?? task?.createdAt) > Date.now() && (
          <div className='tag text-info bg-info'>
            <i className='fa-solid fa-business-time'></i> Coming soon
          </div>
        )}
      </div>
    </>
  )
}

export default TaskCardTags
