import { RootState } from '@redux/store'
import { useSelector } from 'react-redux'
import './TableContent.scss'
import { useEffect, useState } from 'react'
import { ListResponseForBoard, TaskResponseForTable } from '@utils/types'

function TableContent() {
  const project = useSelector((state: RootState) => state.project.activeProject)
  const [tasks, setTasks] = useState<TaskResponseForTable[]>([])
  const transferData = (lists?: ListResponseForBoard[]) => {
    if (!lists) return []
    let task = [] as TaskResponseForTable[]
    lists?.forEach(list => {
      task = task.concat(
        list?.tasks?.map(t => ({ ...t, listName: list.name } as TaskResponseForTable)) as TaskResponseForTable[]
      )
    })
    return task
  }
  useEffect(() => {
    const transferedTasks = transferData(project.board.lists)
    setTasks(transferedTasks)
  }, [project])
  return (
    <>
      <div className='table-content'>
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Task name</th>
              <th>Status</th>
              <th>Priority</th>
              <th>Due date</th>
            </tr>
          </thead>
          <tbody>
            {tasks?.map((task, index) => {
              return (
                <tr key={task.id}>
                  <td>{index}</td>
                  <td>{task.name}</td>
                  <td>{task.listName}</td>
                  <td>{task.priority || <span className='text-light'>[ Not set ]</span>}</td>
                  <td>{task.dueDate}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </>
  )
}

export default TableContent
