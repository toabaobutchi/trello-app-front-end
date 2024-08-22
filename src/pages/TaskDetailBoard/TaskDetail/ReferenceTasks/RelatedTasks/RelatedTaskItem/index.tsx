import { RelatedTaskResponse } from '@utils/types/task.type'
import './RelatedTaskItem.scss'
import Flex from '@comps/StyledComponents'
import { getDateString } from '@utils/functions'
import Button from '@comps/Button'
import Tooltip from '@comps/Tooltip-v2'
import { NavLink } from 'react-router-dom'
import { useContext, useState } from 'react'
import { TaskDetailContext } from '@pages/TaskDetailBoard/context'
import { updateTask } from '@services/task.services'
import { projectSlice } from '@redux/ProjectSlice'
import { useDispatch } from 'react-redux'
import { hubs, ProjectHub } from '@utils/Hubs'

type RelatedTaskItemProps = {
  task: RelatedTaskResponse
  onDelete?: (refTaskId: string) => void
  isChildren?: boolean
}

function RelatedTaskItem({ task, isChildren = false, onDelete = () => {} }: RelatedTaskItemProps) {
  const context = useContext(TaskDetailContext)
  const dispatch = useDispatch()
  const [projectHub] = useState(new ProjectHub())
  const handleDelete = () => {
    onDelete(task.id)
  }
  const handleSetStartDate = async () => {
    if (context?.task?.id && task.dueDate && !isChildren) {
      const taskId = context?.task?.id
      const res = await updateTask(taskId, { startedAt: task.dueDate })
      if (res?.isSuccess) {
        const data = res.data
        context?.setTask?.(prev => ({ ...prev, startedAt: data?.startedAt } as typeof prev))
        
        dispatch(projectSlice.actions.updateTaskInfo(data))

        if (projectHub.isConnected && data) {
          // SendUpdateTaskInfo
          projectHub.connection?.invoke(hubs.project.send.updateTaskInfo, data)
        }
      }
    }
  }
  return (
    <>
      <div
        className={`related-tasks-item related-tasks-item__${task.priority?.toLowerCase() || 'default'}`}
        key={task.id}
      >
        <div className='related-tasks-item-info'>
          <Flex $alignItem='center' $gap='0.5rem' style={{ marginBottom: '0.2rem' }}>
            <NavLink to={`../task/${task.id}`} className='related-tasks-item-info-name'>
              {task.name}
            </NavLink>
            <div
              className={`related-tasks-item-info-priority related-tasks-item-info-priority__${
                task.priority?.toLowerCase() || 'default'
              }`}
            >
              {task.priority ? task.priority + ' Priority' : 'Priority not set'}
            </div>
            {task.isCompleted && (
              <p className='related-tasks-item-tag text-success bg-success'>
                <i className='fa-solid fa-check'></i> Completed
              </p>
            )}
          </Flex>
          <Flex $flexDirection='column'>
            <div className='related-tasks-item-info-start-date'>
              <i className='fa-regular fa-calendar'></i> Start date:{' '}
              {task.startedAt ? (
                getDateString(new Date(task.startedAt))
              ) : (
                <span className='text-secondary'>[Not set]</span>
              )}
            </div>
            <div className='related-tasks-item-info-due-date'>
              <i className='fa-regular fa-clock'></i> Due date:{' '}
              {task.dueDate ? getDateString(new Date(task.dueDate)) : <span className='text-secondary'>[Not set]</span>}
            </div>
          </Flex>
        </div>
        <div className='related-tasks-item-actions'>
          {Boolean(task.dueDate) && !isChildren && (
            <Tooltip position='top' arrow content='Use this due date as begining'>
              <Button onClick={handleSetStartDate} variant='text' className='set-start-date-btn'>
                <i className='fa-solid fa-wrench'></i>
              </Button>
            </Tooltip>
          )}
          <Tooltip position='left' arrow content='Remove this task'>
            <Button onClick={handleDelete} variant='text' theme='danger' className='delete-related-task-btn'>
              <i className='fa-regular fa-trash-can'></i>
            </Button>
          </Tooltip>
        </div>
      </div>
    </>
  )
}

export default RelatedTaskItem
