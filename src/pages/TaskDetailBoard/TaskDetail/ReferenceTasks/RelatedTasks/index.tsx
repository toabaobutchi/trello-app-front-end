import { RelatedTaskResponse } from '@utils/types'
import './RelatedTasks.scss'
import RelatedTaskItem from './RelatedTaskItem'

type RelatedTasksProps = {
  tasks?: RelatedTaskResponse[]
}

function RelatedTasks({ tasks }: RelatedTasksProps) {
  return (
    <>
      <div className='related-tasks'>
        {tasks?.map(task => (
          <RelatedTaskItem task={task} key={task.id} />
        ))}
      </div>
    </>
  )
}

export default RelatedTasks
