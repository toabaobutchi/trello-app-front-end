import Flex from '@comps/StyledComponents/Flex'
import './Project.scss'
import SearchInput from '@comps/SearchInput'
import Button from '@comps/Button'
import Column from '@comps/Column'
import TaskCard from '@comps/TaskCard'

function Project() {
  return (
    <>
      <Flex $flexDirection='column' style={{ width: '100%', height: '100%' }}>
        <Flex $alignItem='center' $justifyContent='space-between' $flexWrap='wrap' className='project-header'>
          <Flex $alignItem='center' $gap='2rem'>
            <div className='page-header' style={{ marginBottom: '0' }}>
              <i className='fa-brands fa-flipboard'></i> Project
            </div>
            <Flex $gap='1rem' $alignItem='center' className='project-tools'>
              <div className='project-tool-item view-mode active'>
                <i className='fa-solid fa-table-columns'></i> Board
              </div>
              <div className='project-tool-item view-mode'>
                <i className='fa-solid fa-table-list'></i> Table
              </div>
              <div className='project-tool-item view-mode'>
                <i className='fa-regular fa-calendar-days'></i> Calendar
              </div>
              <div className='project-tool-item view-mode'>
                <i className='fa-solid fa-chart-gantt'></i> Chart
              </div>
            </Flex>
          </Flex>
          <Flex $alignItem='center' $gap='1rem' $flexWrap='wrap'>
            <Button variant='text' theme='default'>
              <i className='fa-solid fa-filter'></i> Filters <i className='fa-solid fa-caret-down'></i>
            </Button>
            <SearchInput attributes={{ id: 'search-card-input', placeholder: 'Search in project' }}></SearchInput>
            <Button variant='filled'>
              <i className='fa-regular fa-share-from-square'></i> Invite
            </Button>
          </Flex>
        </Flex>
        <Flex $gap='1.5rem' className='column-list'>
          <Column columnName='To do'>
            <TaskCard priority='High' />
            <TaskCard />
            <TaskCard priority='Low' />
          </Column>
          <Column columnName='Doing'>
            <TaskCard priority='Medium' />
            <TaskCard priority='Normal' />
            <TaskCard priority='Low' />
            <TaskCard />
            <TaskCard priority='High' />
          </Column>
          <Column columnName='Done'>
            <TaskCard priority='Low' />
            <TaskCard priority='Medium' />
          </Column>
        </Flex>
      </Flex>
    </>
  )
}

export default Project
