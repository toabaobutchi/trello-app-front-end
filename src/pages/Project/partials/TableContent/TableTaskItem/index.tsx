import Button from '@comps/Button'
import Flex from '@comps/StyledComponents'
import PriorityTag from '@comps/TaskCard/PriorityTag'
import TaskCardTags from '@comps/TaskCard/TaskCardTags'
import { getDateString } from '@utils/functions'
import { TaskResponseForTable } from '@utils/types'
import { NavLink } from 'react-router-dom'

type TableTaskItemProps = {
  task: TaskResponseForTable
  isHighlight?: boolean
}

function TableTaskItem({ task, isHighlight = false }: TableTaskItemProps) {
  return (
    <tr className={`task-row__${isHighlight && task?.priority?.toLowerCase()}`}>
      <td>
        <input
          type='checkbox'
          className='table-option-checkbox'
          name={`table-check-${task?.id}`}
          id={`table-check-${task?.id}`}
          value={task?.id}
        />
      </td>
      <td className='table-task-name'>
        <NavLink to={`task/${task.id}`}>{task.name}</NavLink>
      </td>
      <td>{task.listName}</td>
      <td>
        {task.priority ? <PriorityTag priority={task.priority} /> : <span className='text-light'>[ Not set ]</span>}
      </td>
      <td>
        {task.startedAt ? getDateString(new Date(task.startedAt)) : <span className='text-light'>[ Not set ]</span>}
      </td>
      <td>{task.dueDate ? getDateString(new Date(task.dueDate)) : <span className='text-light'>[ Not set ]</span>}</td>
      <td>
        {task?.completedSubTaskCount}/{task?.subTaskCount}
      </td>
      <td>{task?.taskAssignmentIds?.length}</td>
      <td>
        <TaskCardTags task={task} />
      </td>
      <td>
        <Flex $alignItem='center' $gap='0.5rem' $justifyContent='center'>
          <Button variant='filled' theme='danger' className='table-task-action-button table-task-action-button__delete'>
            <i className='fa-regular fa-trash-can'></i>
          </Button>
          <Button
            variant='filled'
            theme='warning'
            className='table-task-action-button table-task-action-button__update'
          >
            <i className='fa-solid fa-pen-to-square'></i>
          </Button>
        </Flex>
      </td>
    </tr>
  )
}

export default TableTaskItem
