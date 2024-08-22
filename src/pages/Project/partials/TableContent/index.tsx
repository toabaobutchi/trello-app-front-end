import './TableContent.scss'
import { useEffect, useState } from 'react'
import { TaskResponseForTable } from '@utils/types/task.type'
import TableHeader from './TableHeader'
import Flex from '@comps/StyledComponents/Flex'
import SwitchButton from '@comps/SwitchButton'
import { getTasksInProject } from '@utils/functions'
import { useProjectSelector } from '@hooks/useProjectSelector'
import TableTaskItem from './TableTaskItem'
import { useSearchParams } from 'react-router-dom'
import {
  SortByNameMenu,
  SortByStartDateMenu,
  SortByDueDateMenu,
  SortBySubtaskMenu,
  SortByAssigneeCountMenu
} from './TableHeaderSortMenu'

export type LinearSort = 'asc' | 'desc'
export type SubtaskSort = 'asc-completed' | 'desc-completed' | LinearSort
export const SORT_BY_NAME = 'sortByName'
export const SORT_BY_START_DATE = 'sortByStartDate'
export const SORT_BY_DUE_DATE = 'sortByDueDate'
export const SORT_BY_SUBTASK = 'sortBySubtask'
export const SORT_BY_ASSIGNEES = 'sortByAssignees'

function TableContent() {
  const { board: project } = useProjectSelector()
  const [tasks, setTasks] = useState<TaskResponseForTable[]>([])
  const [highlightRow, setHighlightRow] = useState(false)
  const [searchParams] = useSearchParams()
  useEffect(() => {
    const transferedTasks = getTasksInProject(project?.lists)
    const validateCompareResult = (result: number) => {
      if (result > 0) return 1
      if (result < 0) return -1
      return 0
    }
    const handleSortByName = (a: TaskResponseForTable, b: TaskResponseForTable) => {
      const sortByName = searchParams.get(SORT_BY_NAME) as LinearSort | null
      let compareResult = 0
      if (sortByName) {
        if (sortByName === 'asc') {
          compareResult = a.name.localeCompare(b.name)
        } else {
          compareResult = b.name.localeCompare(a.name)
        }
        compareResult = validateCompareResult(compareResult)
      }
      return compareResult
    }
    const handleSortByNumber = (
      a: TaskResponseForTable,
      b: TaskResponseForTable,
      getter: (obj: TaskResponseForTable) => number,
      queryKey: string
    ) => {
      const sortByStartDate = searchParams.get(queryKey) as LinearSort | null
      let compareResult = 0

      if (sortByStartDate) {
        if (sortByStartDate === 'asc') {
          compareResult = getter(a) - getter(b)
        } else {
          compareResult = getter(b) - getter(a)
        }
        compareResult = validateCompareResult(compareResult)
      }
      return compareResult
    }
    const handleSortBySubtask = (a: TaskResponseForTable, b: TaskResponseForTable) => {
      const sortBySubtask = searchParams.get(SORT_BY_SUBTASK) as SubtaskSort | null
      let compareResult = 0
      if (sortBySubtask) {
        if (sortBySubtask.includes('completed')) {
          // sort by completed
          if (sortBySubtask.includes('asc')) {
            compareResult = (a.completedSubTaskCount || 0) - (b.completedSubTaskCount || 0)
          } else {
            compareResult = (b.completedSubTaskCount || 0) - (a.completedSubTaskCount || 0)
          }
        } else {
          // Sort by subtasks count
          if (sortBySubtask === 'asc') {
            compareResult = (a.subTaskCount || 0) - (b.subTaskCount || 0)
          } else {
            compareResult = (b.subTaskCount || 0) - (a.subTaskCount || 0)
          }
        }
        compareResult = validateCompareResult(compareResult)
      }
      return compareResult
    }

    const handleSort = (a: TaskResponseForTable, b: TaskResponseForTable) => {
      let compareResult = 0

      compareResult += handleSortByName(a, b)
      compareResult += handleSortByNumber(a, b, t => t.startedAt || 0, SORT_BY_START_DATE)
      compareResult += handleSortByNumber(a, b, t => t.dueDate || 0, SORT_BY_DUE_DATE)
      compareResult += handleSortBySubtask(a, b)
      compareResult += handleSortByNumber(a, b, t => t.taskAssignmentIds.length || 0, SORT_BY_ASSIGNEES)

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
                <SortByAssigneeCountMenu />,
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
