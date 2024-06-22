import Button from '@comps/Button'
import SearchInput from '@comps/SearchInput'
import Flex from '@comps/StyledComponents/Flex'
import ProjectViewModeNavBar from './ProjectViewModeNavBar'
import ProjectFilterMenu from './ProjectFilterMenu'

function ProjectHeader({ boardName }: { boardName: string }) {
  return (
    <>
      <Flex $alignItem='center' $justifyContent='space-between' $flexWrap='wrap' className='project-header'>
        <Flex $alignItem='center' $gap='2rem'>
          <div className='page-header' style={{ marginBottom: '0' }}>
            <i className='fa-brands fa-flipboard'></i> {boardName}
          </div>
          <ProjectViewModeNavBar />
        </Flex>
        <Flex $alignItem='center' $gap='1rem' $flexWrap='wrap'>
          <ProjectFilterMenu />
          <SearchInput attributes={{ id: 'search-card-input', placeholder: 'Search in project' }}></SearchInput>
          <Button variant='filled'>
            <i className='fa-regular fa-share-from-square'></i> Invite
          </Button>
        </Flex>
      </Flex>
    </>
  )
}

export default ProjectHeader
