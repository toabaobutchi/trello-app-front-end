import TaskCardTags from '@comps/TaskCard/TaskCardTags'
import Tooltip from '@comps/Tooltip-v2'
import { TaskResponseForBoard } from '@utils/types'
import { NavLink } from 'react-router-dom'

function TaskItem({ task }: { task: TaskResponseForBoard }) {
  return (
    <div
      className={`list-state-task-item list-state-task-item__${
        task.priority?.toLowerCase() ?? 'default'
      } row jcsb gap-2`}
    >
      <div style={{ width: '35%' }}>
        <NavLink to={`task/${task.id}`} className='list-state-task-item-name'>
          {task.name}
        </NavLink>
        <TaskCardTags task={task} />
      </div>
      {task.subTaskCount !== undefined && task.subTaskCount > 0 && (
        <Tooltip
          arrow
          position='top'
          content={`Completed: ${task.completedSubTaskCount ?? 0}/${task.subTaskCount ?? 1}`}
          className='list-state-task-item-subtasks'
        >
          <div
            style={{ width: `${((task.completedSubTaskCount ?? 0) * 100) / (task.subTaskCount ?? 1)}%` }}
            className='list-state-task-item-completed-subtask'
          ></div>
        </Tooltip>
      )}
    </div>
  )
}

export default TaskItem
