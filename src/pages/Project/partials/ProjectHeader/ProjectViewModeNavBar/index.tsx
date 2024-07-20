import Flex from '@comps/StyledComponents/Flex'
import { linkCreator } from '@routes/router'
import { memo } from 'react'
import { NavLink } from 'react-router-dom'

const ProjectViewModeNavBar = memo(
  ({ projectId, ownerShip, slug }: { projectId: string; ownerShip: string; slug: string }) => {
    return (
      <>
        <Flex $gap='1rem' $alignItem='center' className='project-view-mode'>
          <NavLink
            to={linkCreator.project({ projectId, ownerShip, slug, viewMode: 'board' })}
            className='project-view-mode-item view-mode'
          >
            <i className='fa-solid fa-table-columns'></i> <span className='project-view-mode-item-text'>Board</span>
          </NavLink>
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
            <i className='fa-regular fa-calendar-days'></i> <span className='project-view-mode-item-text'>Calendar</span>
          </NavLink>
          <NavLink
            to={linkCreator.project({ projectId, ownerShip, slug, viewMode: 'chart' })}
            className='project-view-mode-item view-mode'
          >
            <i className='fa-solid fa-chart-gantt'></i> <span className='project-view-mode-item-text'>Chart</span>
          </NavLink>
        </Flex>
      </>
    )
  }
)

export default ProjectViewModeNavBar
