import { useProjectSelector } from '@hooks/useProjectSelector'
import { getFlatTasks } from '@utils/functions'
import { AssignmentResponse } from '@utils/types'
import { useMemo, useState } from 'react'
import TaskItem from '../../ListState/ListStateItem/TaskItem'

function AssignmentInfoItem({ member }: { member: AssignmentResponse }) {
  const { board } = useProjectSelector()
  const [expanded, setExpanded] = useState(false)
  const taskCount = useMemo(() => {
    const tasks = getFlatTasks(board) ?? []
    return { doing: tasks.filter(t => t.taskAssignmentIds.includes(member.id)) || [], total: tasks || [] }
  }, [board])
  const handleToggleExpanded = () => setExpanded(!expanded)
  return (
    <>
      <div
        onClick={handleToggleExpanded}
        className={`assignment-info-item row gap-1 jcsb${expanded ? ' expanded' : ''}`}
      >
        <div className='assignment-info-item-info row gap-1'>
          <img src={member.avatar} alt={member.avatar} className='assignment-info-item-avatar' />
          <div>
            <p className='assignment-info-item-name'>{member.displayName}</p>
            <p className='assignment-info-item-email'>{member.email}</p>
          </div>
        </div>
        <div className='doing-task-total-count'>
          {taskCount.total.length !== 0 && (
            <div
              className='doing-task-count'
              style={{ width: `${(taskCount.doing.length * 100) / taskCount.total.length}%` }}
            ></div>
          )}
        </div>
        <div className={`doing-task-ratio${expanded ? ' expanded' : ''}`}>
          {taskCount.doing.length}/{taskCount.total.length} tasks
        </div>
      </div>
      <div className='member-tasks'>{expanded && taskCount.doing.map(t => <TaskItem key={t.id} task={t} />)}</div>
    </>
  )
}

export default AssignmentInfoItem
