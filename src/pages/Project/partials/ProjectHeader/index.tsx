import Flex from '@comps/StyledComponents/Flex'
import Tooltip from '@comps/Tooltip-v2'
import { usePageParams } from '@hooks/usePageParams'
import { useProjectSelector } from '@hooks/useProjectSelector'
import { linkCreator } from '@routes/router'
import { ProjectPageParams } from '@utils/types/page-params.type'
import { NavLink } from 'react-router-dom'
import ProjectFilterMenu from './ProjectFilterMenu'
import './ProjectHeader.responsive.scss'
import ProjectSearch from './ProjectSearch'
import ProjectUtilities from './ProjectUtilities'
import ProjectViewModeNavBar from './ProjectViewModeNavBar'
import ProjectHeaderInfo from './ProjectHeaderInfo'

function ProjectHeader() {
  const project = useProjectSelector().board
  const params = usePageParams<ProjectPageParams>()
  return (
    <>
      <Flex $alignItem='center' $gap='1rem' $flexWrap='wrap' className='project-header'>
        <Flex $alignItem='center' $gap='2rem'>
          {/* <WorkspaceTreeMenu /> */}
          <ProjectHeaderInfo project={project} />
        </Flex>
        <ProjectSearch />
        <Flex $alignItem='center' $gap='1rem' $flexWrap='wrap'>
          <Tooltip content='Share project' position='bottom' arrow>
            <NavLink className='project-share-button' to={linkCreator.shareProject(params)}>
              <i className='fa-solid fa-share-nodes'></i>&nbsp; Share project
            </NavLink>
          </Tooltip>
          <ProjectUtilities />
        </Flex>
      </Flex>
      {params.projectId === project.id && Boolean(params.viewMode) && (
        <Flex $alignItem='center' $justifyContent='space-between' className='w-full mb-1 bold'>
          <ProjectViewModeNavBar
            projectId={project?.id}
            ownerShip={project?.context?.toLowerCase()}
            slug={project?.slug ?? ''}
          />
          <ProjectFilterMenu />
        </Flex>
      )}
    </>
  )
}

export default ProjectHeader
