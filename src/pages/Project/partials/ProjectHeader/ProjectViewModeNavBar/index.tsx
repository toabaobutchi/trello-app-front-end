import SelectList from '@comps/SelectList'
import Flex from '@comps/StyledComponents'
import SwitchButton from '@comps/SwitchButton'
import config from '@confs/app.config'
import { usePageParams } from '@hooks/usePageParams'
import useQueryString from '@hooks/useQueryString'
import { linkCreator } from '@routes/router'
import { getProjectPageParams } from '@utils/functions'
import { SelectListItem } from '@utils/types'
import { ProjectPageParams } from '@utils/types/page-params.type'
import { ProjectResponseForBoard } from '@utils/types/project.type'
import { memo } from 'react'
import { useNavigate } from 'react-router-dom'

const viewModeSelectListItems: SelectListItem[] = [
  {
    value: 'overview',
    display: (
      <>
        <i className='fa-regular fa-clipboard'></i> Overview
      </>
    )
  },
  {
    value: 'board',
    display: (
      <>
        <i className='fa-brands fa-trello'></i> Task Board
      </>
    )
  },
  {
    value: 'table',
    display: (
      <>
        {' '}
        <i className='fa-solid fa-table-list'></i> Table
      </>
    )
  },
  {
    value: 'calendar',
    display: (
      <>
        <i className='fa-regular fa-calendar-days'></i> Calendar
      </>
    )
  }
]

const boardModeQsKey = config.qs.boardMode

const ProjectViewModeNavBar = memo(({ project }: { project: ProjectResponseForBoard }) => {
  const [query, queryHandler] = useQueryString()
  const navigate = useNavigate()
  const projectParams = usePageParams<ProjectPageParams>()
  const isCompactView = query[boardModeQsKey] === 'compact'

  const handleToggleCompactView = (e: React.ChangeEvent<HTMLInputElement>) => {
    queryHandler.set(boardModeQsKey, e.target.checked ? 'compact' : 'detail')
  }

  const handleSelectViewMode = ({ value }: { value: string }) => {
    const projectPageParams = getProjectPageParams(project, value)
    navigate(linkCreator.project(projectPageParams))
  }

  return (
    <div className='project-view-mode d-flex aic gap-3'>
      <Flex $alignItem='center' $gap='0.5rem'>
        <SelectList
          onChoose={handleSelectViewMode}
          label={{
            content: (
              <>
                <i className='fa-solid fa-laptop' /> Project view
              </>
            )
          }}
          items={viewModeSelectListItems}
          size='small'
          selectedValue={projectParams.viewMode}
          theme='light'
        />
      </Flex>
      {projectParams.viewMode === 'board' && (
        <Flex $alignItem='center' $gap='0.3rem' className='task-board-view'>
          <SwitchButton
            onChange={handleToggleCompactView}
            inputAttributes={{
              id: 'task-board-toggle-view',
              type: 'checkbox',
              checked: isCompactView
            }}
            icon={{
              unchecked: <i className='fa-solid fa-expand'></i>,
              checked: <i className='fa-solid fa-compress'></i>
            }}
            theme={{
              unchecked: 'primary'
            }}
          />
          <label htmlFor='task-board-toggle-view' className={`cpointer ${isCompactView ? 'text-success' : 'text-primary'}`}>
            {isCompactView ? 'Compact' : 'Detail'}
          </label>
        </Flex>
      )}
    </div>
  )
})

export default ProjectViewModeNavBar
