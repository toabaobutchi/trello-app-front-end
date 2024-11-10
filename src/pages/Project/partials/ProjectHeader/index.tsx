import Flex from '@comps/StyledComponents/Flex'
import ProjectViewModeNavBar from './ProjectViewModeNavBar'
import ProjectFilterMenu from './ProjectFilterMenu'
import WorkspaceTreeMenu from './WorkspaceTreeMenu'
import ProjectUtilities from './ProjectUtilities'
import './ProjectHeader.responsive.scss'
import ProjectSearch from './ProjectSearch'
import { getDateString } from '@utils/functions'
import { NavLink } from 'react-router-dom'
import { linkCreator } from '@routes/router'

import Tooltip from '@comps/Tooltip-v2'
import { ProjectPageParams } from '@utils/types/page-params.type'
import { useProjectSelector } from '@hooks/useProjectSelector'
import { usePageParams } from '@hooks/usePageParams'

function ProjectHeader() {
  const project = useProjectSelector()
  console.log('ProjectHeader >> ', project)
  const params = usePageParams<ProjectPageParams>()
  return (
    <>
      <Flex $alignItem='center' $justifyContent='space-between' $flexWrap='wrap' className='project-header'>
        <Flex $alignItem='center' $gap='2rem'>
          <WorkspaceTreeMenu />
          <div>
            <Flex $alignItem='center' $gap='0.5rem'>
              <p className='page-header project-name'>
                <i className='fa-brands fa-flipboard'></i> {project?.board?.name}
              </p>
              <p className='text-secondary project-info-toggle-button'>
                <i className='fa-solid fa-circle-info'></i>
              </p>
            </Flex>
            <p className='text-secondary' style={{ fontSize: '0.9rem' }}>
              <i className='fa-regular fa-calendar'></i> Due date:{' '}
              {project?.board.dueDate ? getDateString(new Date(project?.board.dueDate)) : 'Not set'}
            </p>
          </div>
        </Flex>
        <Flex $alignItem='center' $gap='1rem' $flexWrap='wrap'>
          <Tooltip content='Share project' position='bottom' arrow>
            <NavLink className='project-share-button' to={linkCreator.shareProject(params)}>
              <i className='fa-solid fa-share-nodes'></i>&nbsp; Share project
            </NavLink>
          </Tooltip>
          <ProjectUtilities />
          <ProjectSearch />
        </Flex>
      </Flex>
      {params.projectId === project.board.id && Boolean(params.viewMode) && (
        <Flex $alignItem='center' $justifyContent='space-between' className='w-full mb-1 bold'>
          <ProjectViewModeNavBar
            projectId={project?.board?.id}
            ownerShip={project?.board?.context?.toLowerCase()}
            slug={project?.board?.slug ?? ''}
          />
          <ProjectFilterMenu />
        </Flex>
      )}
    </>
  )
}

export default ProjectHeader
