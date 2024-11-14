import Flex from '@comps/StyledComponents/Flex'
import Tooltip from '@comps/Tooltip-v2'
import { usePageParams } from '@hooks/usePageParams'
import { useProjectSelector } from '@hooks/useProjectSelector'
import { linkCreator } from '@routes/router'
import { ProjectPageParams } from '@utils/types/page-params.type'
import { NavLink } from 'react-router-dom'
import ProjectFilterMenu from './ProjectFilterMenu'
import './ProjectHeader.responsive.scss'
import './ProjectHeader.scss'
import ProjectHeaderInfo from './ProjectHeaderInfo'
import ProjectMembers from './ProjectMembers'
import ProjectSearch from './ProjectSearch'
import ProjectSort from './ProjectSort'
import ProjectUtilities from './ProjectUtilities'
import ProjectViewModeNavBar from './ProjectViewModeNavBar'

function ProjectHeader() {
  const project = useProjectSelector().board
  const params = usePageParams<ProjectPageParams>()
  return (
    <>
      <Flex $alignItem='center' $gap='1rem' $flexWrap='wrap' className='project-header'>
        <Flex $alignItem='center' $gap='2rem'>
          <ProjectHeaderInfo project={project} />
        </Flex>
        <ProjectSearch />
        <ProjectMembers />
        <Flex $alignItem='center' $gap='1rem' $flexWrap='wrap'>
          <Tooltip content='Share this project' position='bottom' arrow>
            <NavLink className='project-share-button' to={linkCreator.shareProject(params)}>
              <i className='fa-solid fa-user-plus' />
              &nbsp; Share
            </NavLink>
          </Tooltip>
          <ProjectUtilities />
        </Flex>
      </Flex>
      {params.projectId === project.id && !!params.viewMode && (
        <Flex $alignItem='center' $justifyContent='space-between' className='w-full mb-1'>
          <ProjectViewModeNavBar project={project} />
          <Flex $alignItem='center' $gap='0.5rem'>
            <ProjectSort />
            <ProjectFilterMenu />
          </Flex>
        </Flex>
      )}
    </>
  )
}

export default ProjectHeader
