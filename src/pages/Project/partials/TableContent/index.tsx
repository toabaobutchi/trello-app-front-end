import { RootState } from '@redux/store'
import { useSelector } from 'react-redux'
import './TableContent.scss'
import { useEffect, useState } from 'react'
import { ListResponseForBoard, TaskResponseForTable } from '@utils/types'
import TableHeader from './TableHeader'
import Flex from '@comps/StyledComponents/Flex'
import SwitchButton from '@comps/SwitchButton'

function TableContent() {
  const project = useSelector((state: RootState) => state.project.activeProject)
  const [tasks, setTasks] = useState<TaskResponseForTable[]>([])
  const [highlightRow, setHighlightRow] = useState(false)
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
  const handleToggleHighLight = () => setHighlightRow(!highlightRow)
  return (
    <>
      <div className='table-content mt-1'>
        <Flex $alignItem='center' $gap='0.5rem' className='mb-1'>
          <SwitchButton
            inputAttributes={{
              id: 'highlight-switch-button',
              type: 'checkbox',
              checked: highlightRow
            }}
            onChange={handleToggleHighLight}
          />
          <label
            className={`cpointer ${highlightRow ? 'text-success' : 'text-light'}`}
            htmlFor='highlight-switch-button'
          >
            Highlight row by priority
          </label>
        </Flex>
        <table>
          <TableHeader
            items={['#', 'Task name', 'Status', 'Priority', 'Due date', 'Subtasks', 'Assignees', 'Comments', 'Actions']}
          />
          <tbody>
            {tasks?.map((task, index) => {
              return (
                <tr key={task.id} className={`task-row__${highlightRow && task?.priority?.toLowerCase()}`}>
                  <td>
                    <input
                      type='checkbox'
                      className='table-option-checkbox'
                      name={`table-check-${task?.id}`}
                      id={`table-check-${task?.id}`}
                      value={task?.id}
                    />
                  </td>
                  <td>{index}</td>
                  <td className='table-task-name'>{task.name}</td>
                  <td>{task.listName}</td>
                  <td>{task.priority || <span className='text-light'>[ Not set ]</span>}</td>
                  <td>
                    {task.dueDate ? (
                      new Date(task.dueDate).toLocaleDateString()
                    ) : (
                      <span className='text-light'>[ Not set ]</span>
                    )}
                  </td>
                  <td>
                    {task?.completedSubTaskCount}/{task?.subTaskCount}
                  </td>
                  <td>{task?.taskAssignmentIds?.length}</td>
                  <td>{task?.commentCount}</td>
                  <td>
                    <button className='table-task-action-button table-task-action-button__delete'>
                      <i className='fa-solid fa-trash-can'></i>
                    </button>
                    <button className='table-task-action-button table-task-action-button__update'>
                      <i className='fa-solid fa-file-pen'></i>
                    </button>
                  </td>
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
