import Expander from '@comps/Expander'
import Flex from '@comps/StyledComponents'
import { linkCreator } from '@routes/router'
import { ProjectCardType, ProjectPageParams } from '@utils/types'
import { NavLink, useParams } from 'react-router-dom'

function ProjectSideBarItem({ item }: { item: ProjectCardType }) {
  const params = useParams() as ProjectPageParams
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
          </Expander>

          <NavLink to={linkCreator.projectMember(params)} className='project-side-bar-item'>
            <i className='fa-solid fa-users-viewfinder'></i>&nbsp; Members
          </NavLink>
          <NavLink to={linkCreator.projectRecycleBin(params)} className='project-side-bar-item'>
            <i className='fa-regular fa-trash-can'></i>&nbsp; Recycle bin
          </NavLink>
        </Expander>
      </Flex>
    </>
  )
}

export default ProjectSideBarItem
