import { RelatedTaskResponse } from '@utils/types'
import './RelatedTasks.scss'

type RelatedTasksProps = {
  tasks?: RelatedTaskResponse[]
}

function RelatedTasks({ tasks }: RelatedTasksProps) {
  return (
    <>
      <div className='related-tasks'></div>
    </>
  )
}

export default RelatedTasks
