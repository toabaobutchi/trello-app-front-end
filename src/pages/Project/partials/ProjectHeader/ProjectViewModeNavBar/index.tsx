import Flex from '@comps/StyledComponents/Flex'
import { memo } from 'react'

const ProjectViewModeNavBar = memo(() => {
  return (
    <>
      <Flex $gap='1rem' $alignItem='center' className='project-view-mode'>
        <div className='project-view-mode-item view-mode active'>
          <i className='fa-solid fa-table-columns'></i> Board
        </div>
        <div className='project-view-mode-item view-mode'>
          <i className='fa-solid fa-table-list'></i> Table
        </div>
        <div className='project-view-mode-item view-mode'>
          <i className='fa-regular fa-calendar-days'></i> Calendar
        </div>
        <div className='project-view-mode-item view-mode'>
          <i className='fa-solid fa-chart-gantt'></i> Chart
        </div>
      </Flex>
    </>
  )
})

export default ProjectViewModeNavBar
