import Flex from '@comps/StyledComponents/Flex'
import SwitchButton from '@comps/SwitchButton'
import { linkCreator } from '@routes/router'
import { memo } from 'react'
import { NavLink, useSearchParams } from 'react-router-dom'

const ProjectViewModeNavBar = memo(
  ({ projectId, ownerShip, slug }: { projectId: string; ownerShip: string; slug: string }) => {
    // const [compactView, setCompactView] = useState(localStorage.getItem(compactViewKey) === 'true')
    const [searchParams, setSearchParams] = useSearchParams()
    const compactView = searchParams.get('boardMode') === 'compact'
    const handleToggleCompactView = (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchParams({ ...searchParams, boardMode: e.target.checked ? 'compact' : 'detail' })
    }
    return (
      <>
        <Flex $gap='1rem' $alignItem='center' className='project-view-mode'>
          <NavLink
            to={linkCreator.project({ projectId, ownerShip, slug, viewMode: 'overview' })}
            className='project-view-mode-item view-mode'
          >
            <i className='fa-regular fa-clipboard'></i> <span className='project-view-mode-item-text'>Overview</span>
          </NavLink>
          <NavLink
            to={linkCreator.project({ projectId, ownerShip, slug, viewMode: 'board' })}
            className='project-view-mode-item view-mode'
          >
            <i className='fa-brands fa-trello'></i> <span className='project-view-mode-item-text'>Task Board</span>
          </NavLink>
          <Flex $alignItem='center' $gap='0.3rem' className='task-board-view'>
            <SwitchButton
              onChange={handleToggleCompactView}
              size='small'
              inputAttributes={{
                id: 'task-board-toggle-view',
                type: 'checkbox',
                checked: compactView
              }}
              icon={{
                unchecked: <i className='fa-solid fa-expand'></i>,
                checked: <i className='fa-solid fa-compress'></i>
              }}
              theme={{
                unchecked: 'primary'
              }}
            />
            <label htmlFor='task-board-toggle-view' className={`cpointer ${compactView ? 'text-success' : 'text-primary'}`}>
              {compactView ? 'Compact' : 'Detail'}
            </label>
          </Flex>
          <NavLink
            to={linkCreator.project({ projectId, ownerShip, slug, viewMode: 'table' })}
            className='project-view-mode-item view-mode'
          >
            <i className='fa-solid fa-table-list'></i> <span className='project-view-mode-item-text'>Table</span>
          </NavLink>
          <NavLink
            to={linkCreator.project({ projectId, ownerShip, slug, viewMode: 'calendar' })}
            className='project-view-mode-item view-mode'
          >
            <i className='fa-regular fa-calendar-days'></i>{' '}
            <span className='project-view-mode-item-text'>Calendar</span>
          </NavLink>
        </Flex>
      </>
    )
  }
)

export default ProjectViewModeNavBar
