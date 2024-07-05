import Flex from '@comps/StyledComponents/Flex'
import { linkCreator } from '@routes/router'
import { memo } from 'react'
import { NavLink } from 'react-router-dom'

const ProjectViewModeNavBar = memo(
  ({ projectId, ownerShip, slug }: { projectId: string; ownerShip: string; slug: string }) => {
    console.log('Project header > ', ownerShip)
    return (
      <>
        <Flex $gap='1rem' $alignItem='center' className='project-view-mode'>
          <NavLink
            to={linkCreator.project({ projectId, ownerShip, slug, viewMode: 'board' })}
            className='project-view-mode-item view-mode'
          >
            <i className='fa-solid fa-table-columns'></i> Board
          </NavLink>
          <NavLink
            to={linkCreator.project({ projectId, ownerShip, slug, viewMode: 'table' })}
            className='project-view-mode-item view-mode'
          >
            <i className='fa-solid fa-table-list'></i> Table
          </NavLink>
          <NavLink
            to={linkCreator.project({ projectId, ownerShip, slug, viewMode: 'calendar' })}
            className='project-view-mode-item view-mode'
          >
            <i className='fa-regular fa-calendar-days'></i> Calendar
          </NavLink>
          <NavLink
            to={linkCreator.project({ projectId, ownerShip, slug, viewMode: 'chart' })}
            className='project-view-mode-item view-mode'
          >
            <i className='fa-solid fa-chart-gantt'></i> Chart
          </NavLink>
        </Flex>
      </>
    )
  }
)

export default ProjectViewModeNavBar
