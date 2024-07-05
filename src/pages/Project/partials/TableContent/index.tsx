import { RootState } from '@redux/store'
import { useSelector } from 'react-redux'
import './TableContent.scss'
import { useEffect, useState } from 'react'
import { TaskResponseForBoard } from '@utils/types'

function TableContent() {
  const project = useSelector((state: RootState) => state.project.activeProject)
  const [tasks, setTasks] = useState<TaskResponseForBoard[]>([])
  useEffect(() => {
    setTasks(prev => {
      let task = prev as TaskResponseForBoard[]
      const lists = project.board.lists
      lists?.forEach(list => {
        task = task.concat(list?.tasks as TaskResponseForBoard[])
      })
      return task
    })
  }, [project])
  console.log(tasks)
  return (
    <>
      <div className='table-content'>
        <table>
          <tr>
            <th>Num</th>
            <th>Task name</th>
            <th>Priority</th>
            <th>Due date</th>
          </tr>
          {tasks?.map(task => {
            return (
              <tr key={task.id}>
                <td>{task.id}</td>
                <td>{task.name}</td>
                <td>{task.priority}</td>
                <td>{task.dueDate}</td>
              </tr>
            )
          })}
        </table>
      </div>
    </>
  )
}

export default TableContent
