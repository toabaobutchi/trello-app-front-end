import Flex from '@comps/StyledComponents/Flex'
import ProjectViewModeNavBar from './ProjectViewModeNavBar'
import ProjectFilterMenu from './ProjectFilterMenu'
import WorkspaceTreeMenu from './WorkspaceTreeMenu'
import { useSelector } from 'react-redux'
import { RootState } from '@redux/store'
import ProjectUtilities from './ProjectUtilities'
import './ProjectHeader.responsive.scss'
import ProjectSearch from './ProjectSearch'
import { getDateString } from '@utils/functions'
import { NavLink } from 'react-router-dom'
import routeLinks from '@routes/router'
import useSubNavigate from '@hooks/useSubNavigate'
import Tooltip from '@comps/Tooltip-v2'

function ProjectHeader() {
  const project = useSelector((state: RootState) => state.project.activeProject)
  const [_, location] = useSubNavigate()
  return (
    <>
      {/* <Flex $alignItem='center' $justifyContent='center' $flexWrap='wrap'></Flex> */}
      <Flex $alignItem='center' $justifyContent='space-between' $flexWrap='wrap' className='project-header'>
        <Flex $alignItem='center' $gap='2rem'>
          <WorkspaceTreeMenu workspaceId={project?.board?.workspaceId} />
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
              Project deadline:{' '}
              {project?.board.dueDate ? getDateString(new Date(project?.board.dueDate * 1000)) : 'Not set'}
            </p>
          </div>
        </Flex>
        <Flex $alignItem='center' $gap='1rem' $flexWrap='wrap'>
          <Tooltip content='Share project' position='bottom' arrow>
            <NavLink className='project-share-button' to={`${location.pathname}/${routeLinks.share}`}>
              <i className='fa-solid fa-share-nodes'></i>&nbsp; Share project
            </NavLink>
          </Tooltip>
          <ProjectSearch />
          <ProjectUtilities />
        </Flex>
      </Flex>
      <Flex $alignItem='center' $justifyContent='space-between' className='w-full mb-1'>
        <ProjectViewModeNavBar
          projectId={project?.board?.id}
          ownerShip={project?.board?.context?.toLowerCase()}
          slug={project?.board?.slug ?? ''}
        />
        <ProjectFilterMenu />
      </Flex>
    </>
  )
}

export default ProjectHeader
