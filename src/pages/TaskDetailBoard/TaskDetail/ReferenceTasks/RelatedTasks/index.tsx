import { RelatedTaskResponse } from '@utils/types/task.type'
import './RelatedTasks.scss'
import RelatedTaskItem from './RelatedTaskItem'

type RelatedTasksProps = {
  tasks?: RelatedTaskResponse[]
  onDelete?: (refTaskId: string) => void
  isChildren?: boolean
}

function RelatedTasks({ tasks, isChildren = false, onDelete = () => {} }: RelatedTasksProps) {
  return (
    <>
      <div className='related-tasks'>
        {tasks?.map(task => (
          <RelatedTaskItem isChildren={isChildren} task={task} key={task.id} onDelete={onDelete} />
        ))}
      </div>
    </>
  )
}

export default RelatedTasks
