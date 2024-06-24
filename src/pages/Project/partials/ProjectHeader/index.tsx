import SearchInput from '@comps/SearchInput'
import Flex from '@comps/StyledComponents/Flex'
import ProjectViewModeNavBar from './ProjectViewModeNavBar'
import ProjectFilterMenu from './ProjectFilterMenu'
import ProjectShare from './ProjectShare'
import WorkspaceTreeMenu from './WorkspaceTreeMenu'
import { useSelector } from 'react-redux'
import { RootState } from '@redux/store'

function ProjectHeader() {
  const project = useSelector((state: RootState) => state.project.activeProject.board)
  return (
    <>
      <Flex $alignItem='center' $justifyContent='space-between' $flexWrap='wrap' className='project-header'>
        <Flex $alignItem='center' $gap='2rem'>
          <Flex $alignItem='center' $gap='1rem'>
            <WorkspaceTreeMenu workspaceId={project?.workspaceId} />
            <div className='page-header' style={{ marginBottom: '0' }}>
              <p>
                <i className='fa-brands fa-flipboard'></i> {project?.name}
              </p>
              <p className='text-secondary' style={{ fontSize: '0.85rem' }}>
                {project?.memberCount ?? 0} members
              </p>
            </div>
          </Flex>
          <ProjectViewModeNavBar
            projectId={project?.id}
            ownerShip={project?.context?.toLowerCase()}
            slug={project?.slug ?? ''}
          />
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
