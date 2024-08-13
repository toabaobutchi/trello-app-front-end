import Modal from '@comps/Modal'
import Tooltip from '@comps/Tooltip-v2'
import { useModal } from '@hooks/useModal'
import { ListResponseForBoard } from '@utils/types'
import { useMemo } from 'react'
import TaskItem from './TaskItem'

type PriorityGroup = {
  [key: string]: number
}

function ListStateItem({ list }: { list: ListResponseForBoard }) {
  const [taskModal, handleToggleTaskModal] = useModal()
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
  return (
    <>
      <div onClick={list.tasks?.length ? handleToggleTaskModal : undefined} key={list.id} className='list-state-item'>
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
      <Modal
        layout={{ header: { title: `Tasks in ${list.name}`, closeIcon: true } }}
        style={{ width: '35%' }}
        open={taskModal}
        onClose={handleToggleTaskModal}
      >
        {list.tasks?.map(task => (
          <TaskItem key={task.id} task={task} />
        ))}
      </Modal>
    </>
  )
}

export default ListStateItem
