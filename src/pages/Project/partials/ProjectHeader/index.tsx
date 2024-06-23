import SearchInput from '@comps/SearchInput'
import Flex from '@comps/StyledComponents/Flex'
import ProjectViewModeNavBar from './ProjectViewModeNavBar'
import ProjectFilterMenu from './ProjectFilterMenu'
import ProjectShare from './ProjectShare'
import WorkspaceTreeMenu from './WorkspaceTreeMenu'

function ProjectHeader({ boardName }: { boardName: string }) {
  return (
    <>
      <Flex $alignItem='center' $justifyContent='space-between' $flexWrap='wrap' className='project-header'>
        <Flex $alignItem='center' $gap='2rem'>
          <Flex $alignItem='center' $gap='1rem'>
            {/* <Button variant='outlined'><i className="fa-solid fa-folder-tree"></i></Button> */}
            <WorkspaceTreeMenu />
            <div className='page-header' style={{ marginBottom: '0' }}>
              <i className='fa-brands fa-flipboard'></i> {boardName}
            </div>
          </Flex>
          <ProjectViewModeNavBar />
        </Flex>
        <Flex $alignItem='center' $gap='1rem' $flexWrap='wrap'>
          <ProjectFilterMenu />
          <SearchInput attributes={{ id: 'search-card-input', placeholder: 'Search in project' }}></SearchInput>
          <ProjectShare />
        </Flex>
      </Flex>
    </>
  )
}

export default ProjectHeader
