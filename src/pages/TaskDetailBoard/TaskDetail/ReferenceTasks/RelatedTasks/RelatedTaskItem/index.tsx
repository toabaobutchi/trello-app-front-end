import { RelatedTaskResponse } from '@utils/types'
import './RelatedTaskItem.scss'

type RelatedTaskItemProps = {
  task: RelatedTaskResponse
}

function RelatedTaskItem({ task }: RelatedTaskItemProps) {
  return (
    <>
      <div className='related-tasks-item' key={task.id}>
        {task.name}
      </div>
    </>
  )
}

export default RelatedTaskItem
