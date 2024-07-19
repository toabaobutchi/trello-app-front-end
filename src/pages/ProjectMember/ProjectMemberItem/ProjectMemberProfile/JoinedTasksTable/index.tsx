import { JoinedTaskResponse } from '@utils/types'
import './JoinedTasksTable.scss'
import Flex from '@comps/StyledComponents/Flex'
import { NavLink } from 'react-router-dom'
import { getDateString } from '@utils/functions'
function JoinedTasksTable({ joinedTasks }: { joinedTasks?: JoinedTaskResponse[] }) {
  return (
    <>
      <Flex $alignItem='center' $gap='0.5rem' $flexWrap='wrap' className='joined-tasks-container'>
        {joinedTasks &&
          joinedTasks.length > 0 &&
          joinedTasks.map(task => (
            <div className='joined-task-item'>
              <Flex $alignItem='center' $justifyContent='space-between' $flexWrap='wrap' $gap='0.25rem' className='mb-1'>
                <NavLink to={`../task/${task.id}`} className='joined-task-item-name text-primary'>
                  {task.name}
                </NavLink>
                <Flex $alignItem='center' $gap='0.5rem' className='w-full'>
                  {task.isCompleted && (
                    <p className='joined-task-item-status joined-task-item__completed text-success row gap-1'>
                      Completed <i className='fa-solid fa-check'></i>
                    </p>
                  )}
                  {task.dueDate && task.dueDate * 1000 < Date.now() && (
                    <p className='joined-task-item-status joined-task-item-duedate__overdue text-danger row gap-1'>
                      Overdue <i className='fa-regular fa-calendar-xmark'></i>
                    </p>
                  )}
                  {task.isMarkedNeedHelp && (
                    <p className='joined-task-item-status joined-task-item__need-help text-warning row gap-1'>
                      Need help <i className='fa-regular fa-circle-question'></i>
                    </p>
                  )}
                </Flex>
              </Flex>
              <Flex $alignItem='center' $gap='0.5rem' className='joined-task-item-duedate'>
                Duedate:&nbsp;
                {task?.dueDate ? (
                  <>
                    <p>{getDateString(new Date(task.dueDate * 1000))}</p>
                  </>
                ) : (
                  <>
                    <span className='text-light'>[Not set]</span>
                  </>
                )}
              </Flex>
              <p className='joined-task-item-join-time'>
                Joined/Assigned at:&nbsp; {getDateString(new Date(task.assignedAt))}
              </p>
            </div>
          ))}
      </Flex>
    </>
  )
}

export default JoinedTasksTable
