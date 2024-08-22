import { JoinedTaskResponse } from '@utils/types/task.type'
import './JoinedTasksTable.scss'
import JoinedTaskItem from './JoinedTaskItem'
import { useEffect, useState } from 'react'
function JoinedTasksTable({ joinedTasks }: { joinedTasks?: JoinedTaskResponse[] }) {
  const [tasks, setTasks] = useState(joinedTasks)
  useEffect(() => {
    setTasks(joinedTasks)
  }, [JSON.stringify(joinedTasks)])
  return (
    <>
      {tasks && tasks.length > 0 && (
        <>
          {/* <Flex $alignItem='center' $justifyContent='space-between' className='w-full mb-1 joined-task-filters'>
            <Button variant='text' theme='default'>
              <i className='fa-solid fa-sliders'></i>&nbsp; Filters
            </Button>
            <FloatLabelInput
              label='Search'
              className='joined-tasks-search-input'
              input={{ id: 'search-joined-tasks-input', name: 'searchJoinedTasks' }}
            />
          </Flex> */}
          <div className='joined-tasks-container'>
            {tasks.map(task => (
              <JoinedTaskItem key={task.id} task={task} />
            ))}
          </div>
        </>
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
