import Tooltip from '@comps/Tooltip-v2'
import { ListResponseForBoard } from '@utils/types/list.type'
import { useMemo, useState } from 'react'
import TaskItem from './TaskItem'

type PriorityGroup = {
  [key: string]: number
}

function ListStateItem({ list }: { list: ListResponseForBoard }) {
  const [expandTasks, setExpandTasks] = useState(false)
  const priorityGroup = useMemo(
    () =>
      list.tasks?.reduce<PriorityGroup>((groups, task) => {
        const priority = task.priority
        if (!priority) groups['Priority Not Set'] = groups['default'] ? groups['default'] + 1 : 1
        else {
          if (!groups[priority]) {
            groups[priority] = 1
          } else groups[priority]++
        }
        return groups
      }, {}) ?? {},
    [list.tasks]
  )
  const handleToggleExpand = () => setExpandTasks(!expandTasks)
  return (
    <>
      <div
        onClick={list.tasks?.length ? handleToggleExpand : undefined}
        key={list.id}
        className={`list-state-item${expandTasks ? ' expanded' : ''}`}
      >
        <p className='list-state-item-name'>
          {list.name} ({list.tasks?.length ?? 0})
        </p>
        <div className='list-state-item-progress'>
          {Object.keys(priorityGroup).map(priority => (
            <Tooltip
              key={priority}
              position='top'
              arrow
              content={`${priority}: ${priorityGroup[priority]}`}
              style={{ flex: `${priorityGroup[priority]}` }}
            >
              <div className={`list-state-item-line list-state-item-line__${priority.toLowerCase()}  w-full`}></div>
            </Tooltip>
          ))}
        </div>
      </div>
      <div className={`list-state-tasks-container${expandTasks ? ' expanded' : ''}`}>
        {list.tasks?.map(task => (
          <TaskItem key={task.id} task={task} />
        ))}
      </div>
    </>
  )
}

export default ListStateItem
