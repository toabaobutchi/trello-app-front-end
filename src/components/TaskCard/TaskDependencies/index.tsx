import { useProjectSelector } from '@hooks/useProjectSelector'
import './TaskDependencies.scss'
import { useEffect, useState } from 'react'
import { TaskResponseForBoard } from '@utils/types'
import { getFlatTasks } from '@utils/functions'
import { NavLink } from 'react-router-dom'

type TaskDependenciesProps = {
  dependencyIds: string[]
}

function TaskDependencies({ dependencyIds }: TaskDependenciesProps) {
  const { board } = useProjectSelector()
  const [dependencyTasks, setDependencyTasks] = useState<TaskResponseForBoard[]>([])
  useEffect(() => {
    const tasksInProject = getFlatTasks(board)
    if (!tasksInProject) {
      setDependencyTasks([])
    } else {
      const dependencies = tasksInProject.filter(t => dependencyIds.includes(t.id))
      setDependencyTasks(dependencies)
    }
  }, [dependencyIds])
  return (
    <>
      {dependencyTasks && dependencyTasks.length > 0 && (
        <div className='task-dependencies'>
          <p className='task-dependencies-title'>Dependencies</p>
          {dependencyTasks.map(task => (
            <NavLink
              onClick={e => e.stopPropagation()}
              to={`task/${task.id}`}
              key={task.id}
              className={`task-dependency${task.isCompleted ? ' task-dependency__completed' : ''}`}
            >
              {task.isCompleted ? (
                <i className='fa-solid fa-circle-check'></i>
              ) : (
                <i className='fa-solid fa-hourglass-half'></i>
              )}
              &nbsp; {task.name}
            </NavLink>
          ))}
        </div>
      )}
    </>
  )
}

export default TaskDependencies
