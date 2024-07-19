import { JoinedTaskResponse } from '@utils/types'
import './JoinedTasksTable.scss'
import JoinedTaskItem from './JoinedTaskItem'
function JoinedTasksTable({ joinedTasks }: { joinedTasks?: JoinedTaskResponse[] }) {
  return (
    <>
      {joinedTasks && joinedTasks.length > 0 && (
        <div className='joined-tasks-container'>
          {joinedTasks.map(task => (
            <JoinedTaskItem task={task} />
          ))}
        </div>
      )}

      {(!joinedTasks || joinedTasks.length <= 0) && (
        <p className='w-full text-warning'>
          <i className='fa-solid fa-users-slash'></i> This member has not joined or be assigned to any task yet
        </p>
      )}
    </>
  )
}

export default JoinedTasksTable
