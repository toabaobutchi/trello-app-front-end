import Button from '@comps/Button'
import './TodayTask.scss'

interface TodayTaskProps {
  children?: React.ReactNode
  taskName?: React.ReactNode
  dueDate?: React.ReactNode
}

function TodayTask({ children, taskName, dueDate }: TodayTaskProps) {
  return (
    <>
      <div className='today-tasks-item'>
        <div className='today-tasks-item-header'>
          <p className='today-tasks-item-header-task-name'>{taskName}</p>{' '}
          <p className='today-tasks-item-header-due-date'>Due date: {dueDate}</p>
        </div>
        <div className='today-tasks-item-content'>
          <p className='today-tasks-item-content-description-title'>Description:</p>
          <p className='today-tasks-item-content-description-content'>{children ?? 'No description'}</p>
        </div>
        <Button className='today-tasks-item-go-to-project-btn' variant='outlined' theme='primary'>
          <i className='fa-solid fa-diagram-next'></i> &nbsp; Go to project
        </Button>
      </div>
    </>
  )
}

export default TodayTask
