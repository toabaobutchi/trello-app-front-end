import SearchInput from '@comps/SearchInput'
import Flex from '@comps/StyledComponents/Flex'
import ProjectViewModeNavBar from './ProjectViewModeNavBar'
import ProjectFilterMenu from './ProjectFilterMenu'
import ProjectShare from './ProjectShare'
import WorkspaceTreeMenu from './WorkspaceTreeMenu'
import { useSelector } from 'react-redux'
import { RootState } from '@redux/store'

function ProjectHeader() {
  const project = useSelector((state: RootState) => state.project.activeProject)
  return (
    <>
      <Flex $alignItem='center' $justifyContent='space-between' $flexWrap='wrap' className='project-header'>
        <Flex $alignItem='center' $gap='2rem'>
          <Flex $alignItem='center' $gap='1rem'>
            <WorkspaceTreeMenu workspaceId={project?.board?.workspaceId} />
            <div className='page-header' style={{ marginBottom: '0' }}>
              <p>
                <i className='fa-brands fa-flipboard'></i> {project?.board?.name}
              </p>
              <p className='text-secondary' style={{ fontSize: '0.85rem' }}>
                {project?.board?.memberCount ?? 0} members
              </p>
            </div>
          </Flex>
          <ProjectViewModeNavBar
            projectId={project?.board?.id}
            ownerShip={project?.board?.context?.toLowerCase()}
            slug={project?.board?.slug ?? ''}
          />
          {/* <Flex $alignItem='center' $gap='0.15rem'>
            {project?.members?.map((member, index) => {
              if (index > 7) {
                return
              }
              return (
                <>
                  <Tooltip key={member.id} arrow position='top' content={member?.email}>
                    <img
                      src={member?.avatar}
                      style={{ width: '25px', borderRadius: '50%', objectFit: 'cover' }}
                      alt=''
                    />
                  </Tooltip>
                </>
              )
            })}
          </Flex> */}
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
