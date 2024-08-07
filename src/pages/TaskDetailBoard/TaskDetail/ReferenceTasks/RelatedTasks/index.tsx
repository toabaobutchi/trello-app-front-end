import { RelatedTaskResponse } from '@utils/types'
import './RelatedTasks.scss'

type RelatedTasksProps = {
  tasks?: RelatedTaskResponse[]
}

function RelatedTasks({ tasks }: RelatedTasksProps) {
  return (
    <>
      <div className='related-tasks'>
        {tasks?.map(task => (
          <div className='related-tasks-item' key={task.id}>
            {task.name}
          </div>
        ))}
      </div>
    </>
  )
}

export default RelatedTasks
