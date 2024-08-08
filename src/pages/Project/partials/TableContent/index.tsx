import './TableContent.scss'
import { useEffect, useState } from 'react'
import { TaskResponseForTable } from '@utils/types'
import TableHeader from './TableHeader'
import Flex from '@comps/StyledComponents/Flex'
import SwitchButton from '@comps/SwitchButton'
import { getTasksInProject } from '@utils/functions'
import { useProjectSelector } from '@hooks/useProjectSelector'
import TableTaskItem from './TableTaskItem'
import { useSearchParams } from 'react-router-dom'
import { SortByNameMenu, SortByStartDateMenu, SortByDueDateMenu, SortBySubtaskMenu } from './TableHeaderSortMenu'

export type LinearSort = 'asc' | 'desc'
export type SubtaskSort = 'asc-completed' | 'desc-completed' | LinearSort
export const SORT_BY_NAME = 'sortByName'
export const SORT_BY_START_DATE = 'sortByStartDate'
export const SORT_BY_DUE_DATE = 'sortByDueDate'
export const SORT_BY_SUBTASK = 'sortBySubtask'

function TableContent() {
  const { board: project } = useProjectSelector()
  const [tasks, setTasks] = useState<TaskResponseForTable[]>([])
  const [highlightRow, setHighlightRow] = useState(false)
  const [searchParams] = useSearchParams()
  useEffect(() => {
    const transferedTasks = getTasksInProject(project?.lists)
    const handleSort = (a: TaskResponseForTable, b: TaskResponseForTable) => {
      const sortByName = searchParams.get(SORT_BY_NAME) as LinearSort | null
      const sortByStartDate = searchParams.get(SORT_BY_START_DATE) as LinearSort | null
      let compareResult = 0
      if (sortByName) {
        if (sortByName === 'asc') {
          compareResult += a.name.localeCompare(b.name)
        } else {
          compareResult += b.name.localeCompare(a.name)
        }
      }
      if (sortByStartDate) {
        if (sortByStartDate === 'asc') {
          compareResult += (a.dueDate ?? 0) - (b.dueDate ?? 0)
        } else {
          compareResult += (b.dueDate ?? 0) - (a.dueDate ?? 0)
        }
      }
      return compareResult
    }
    setTasks(transferedTasks.sort(handleSort))
  }, [project, searchParams])

  const handleToggleHighLight = () => setHighlightRow(!highlightRow)

  return (
    <>
      <div className='table-content mt-1 page-slide'>
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
            style={{ fontSize: '1rem' }}
          >
            Highlight row by priority
          </label>
        </Flex>
        <div className='table-content-wrapper'>
          <table>
            <TableHeader
              items={[
                <SortByNameMenu />,
                'Status',
                'Priority',
                <SortByStartDateMenu />,
                <SortByDueDateMenu />,
                <SortBySubtaskMenu />,
                'Assignees',
                'Tags',
                'Actions'
              ]}
            />
            <tbody>
              {tasks?.map(task => (
                <TableTaskItem key={task.id} task={task} isHighlight={highlightRow} />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}

export default TableContent
