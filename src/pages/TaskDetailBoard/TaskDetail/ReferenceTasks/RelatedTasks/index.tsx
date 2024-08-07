import { RelatedTaskResponse } from '@utils/types'
import './RelatedTasks.scss'
import RelatedTaskItem from './RelatedTaskItem'

type RelatedTasksProps = {
  tasks?: RelatedTaskResponse[]
  onDelete?: (refTaskId: string) => void
}

function RelatedTasks({ tasks, onDelete = () => {} }: RelatedTasksProps) {
  return (
    <>
      <div className='related-tasks'>
        {tasks?.map(task => (
          <RelatedTaskItem task={task} key={task.id} onDelete={onDelete} />
        ))}
      </div>
    </>
  )
}

export default RelatedTasks
