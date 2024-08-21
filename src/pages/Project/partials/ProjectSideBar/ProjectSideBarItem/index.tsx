import Expander from '@comps/Expander'
import Flex from '@comps/StyledComponents'
import { usePageParams } from '@hooks/usePageParams'
import { linkCreator } from '@routes/router'
import { ProjectCardType } from '@utils/types'
import { ProjectPageParams } from '@utils/types/page-params.type'
import { NavLink } from 'react-router-dom'

function ProjectSideBarItem({ item }: { item: ProjectCardType }) {
  const params = usePageParams<ProjectPageParams>()
  return (
    <>
      <Flex $flexDirection='column'>
        <Expander
          useArrow={false}
          header={{
            content: (
              <>
                <i className='fa-solid fa-hashtag'></i> {item.name}
              </>
            ),
            className: `${params.projectId === item.id ? 'text-primary bold w-full' : ''}`
          }}
          defaultExpand={params.projectId === item.id}
        >
          <Expander
            useArrow={false}
            defaultExpand={params.projectId === item.id && Boolean(params.viewMode)}
            header={{
              content: (
                <>
                  <i className='fa-solid fa-expand'></i>&nbsp; Views
                </>
              ),
              className: `${params.projectId === item.id && Boolean(params.viewMode) ? 'text-primary bold w-full' : ''}`
            }}
          >
            <NavLink
              className='project-side-bar-item project-side-bar-item-children row jcsb ps-1'
              // key={item.id}
              to={linkCreator.project({
                projectId: item.id,
                slug: item.slug,
                ownerShip: item.context,
                viewMode: 'overview'
              })}
            >
              <span>
                <i className='fa-regular fa-clipboard'></i>&nbsp; Overview
              </span>
            </NavLink>
            <NavLink
              className='project-side-bar-item project-side-bar-item-children row jcsb ps-1'
              // key={item.id}
              to={linkCreator.project({
                projectId: item.id,
                slug: item.slug,
                ownerShip: item.context,
                viewMode: 'board'
              })}
            >
              <span>
                <i className='fa-brands fa-trello'></i>&nbsp; Board
              </span>
            </NavLink>
            <NavLink
              className='project-side-bar-item project-side-bar-item-children row jcsb ps-1'
              // key={item.id}
              to={linkCreator.project({
                projectId: item.id,
                slug: item.slug,
                ownerShip: item.context,
                viewMode: 'table'
              })}
            >
              <span>
                <i className='fa-solid fa-table-list'></i>&nbsp; Table
              </span>
            </NavLink>
            <NavLink
              className='project-side-bar-item project-side-bar-item-children row jcsb ps-1'
              // key={item.id}
              to={linkCreator.project({
                projectId: item.id,
                slug: item.slug,
                ownerShip: item.context,
                viewMode: 'calendar'
              })}
            >
              <span>
                <i className='fa-solid fa-table-list'></i>&nbsp; Calendar
              </span>
            </NavLink>
          </Expander>

          <NavLink to={linkCreator.projectMember(params)} className='project-side-bar-item'>
            <i className='fa-solid fa-users-viewfinder'></i>&nbsp; Members
          </NavLink>
          <NavLink to={linkCreator.projectRecycleBin(params)} className='project-side-bar-item'>
            <i className='fa-regular fa-trash-can'></i>&nbsp; Recycle bin
          </NavLink>
          <NavLink to={linkCreator.changeLog(params)} className='project-side-bar-item'>
            <i className='fa-solid fa-timeline'></i>&nbsp; Change logs
          </NavLink>
        </Expander>
      </Flex>
    </>
  )
}

export default ProjectSideBarItem
