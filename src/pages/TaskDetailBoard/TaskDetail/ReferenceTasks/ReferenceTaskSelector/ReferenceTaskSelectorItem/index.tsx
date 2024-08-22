import { getDateString } from '@utils/functions'
import { TaskResponseForBoard } from '@utils/types/task.type'
import './ReferenceTaskSelectorItem.scss'
import { useState } from 'react'

type ReferenceTaskSelectorItemProps = {
  task: TaskResponseForBoard
  onTaskSelect?: (taskId: string, checked: boolean) => void
}

function ReferenceTaskSelectorItem({ task, onTaskSelect = () => {} }: ReferenceTaskSelectorItemProps) {
  const [checked, setChecked] = useState(false)
  const handleSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(e.target.checked)
    onTaskSelect(e.target.value, e.target.checked)
  }
  return (
    <>
      <div
        className={`reference-task-selector-item reference-task-selector-item__${
          task.priority?.toLowerCase() || 'default'
        }`}
      >
        <div className='reference-task-selector-item-info mb-1 row jcsb w-full'>
          <p className='reference-task-selector-item-info-name'>{task.name}</p>
          <div className='reference-task-selector-item-select-box'>
            <input
              type='checkbox'
              id={`reference-task-selector-input-${task.id}`}
              value={task.id}
              checked={checked}
              onChange={handleSelect}
            />
            <label htmlFor={`reference-task-selector-input-${task.id}`}>
              {checked ? (
                <>
                  <i className='fa-solid fa-check'></i> Selected
                </>
              ) : (
                <>
                  <i className='fa-regular fa-hand'></i> Select
                </>
              )}
            </label>
          </div>
        </div>
        <div className='reference-task-selector-item-info'>
          Priority:{' '}
          <span className='reference-task-selector-item-info-priority'>{task.priority || 'Priority not set'}</span>
        </div>
        <div className='reference-task-selector-item-info reference-task-selector-item-info-creation-time'>
          Created at: {getDateString(new Date(task.createdAt), true)}
        </div>
        <div className='reference-task-selector-item-info reference-task-selector-item-info-start-date'>
          Started at:{' '}
          {task.startedAt ? getDateString(new Date(task.startedAt)) : <span className='text-secondary'>[Not set]</span>}
        </div>
        <div className='reference-task-selector-item-info reference-task-selector-item-info-due-date'>
          Due date:{' '}
          {task.dueDate ? getDateString(new Date(task.dueDate)) : <span className='text-secondary'>[Not set]</span>}
        </div>
      </div>
    </>
  )
}

export default ReferenceTaskSelectorItem
