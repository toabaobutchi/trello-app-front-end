import { useProjectSelector } from '@hooks/useProjectSelector'
import LoadingLayout from '@layouts/LoadingLayout'
import { AppDispatch, RootState } from '@redux/store'
import { workspaceSlice } from '@redux/WorkspaceSlice'
import { linkCreator } from '@routes/router'
import HttpClient from '@utils/HttpClient'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { NavLink } from 'react-router-dom'
import ProjectSideBarItem from './ProjectSideBarItem'

const http = new HttpClient()

function ProjectSideBar() {
  const workspace = useSelector((state: RootState) => state.workspaces.activeWorkspace)
  const { board } = useProjectSelector()
  const projectSidebar = useSelector((state: RootState) => state.sideBar.projectSidebar)
  const dispatch = useDispatch<AppDispatch>()
  useEffect(() => {
    if (!workspace?.id && board?.id) {
      http
        .getAuth(`/${board?.context.toLowerCase() === 'owner' ? 'w' : 'sw'}/${board.workspaceId}/projects`)
        .then(res => {
          if (res?.status === 200) dispatch(workspaceSlice.actions.setActiveWorkspace(res?.data))
        })
        .catch(err => {
          console.error('Can not fetch workspace', err)
        })
    }
  }, [workspace?.id, board?.id, board?.context, board.workspaceId, dispatch])
  return (
    <>
      <LoadingLayout isLoading={!workspace?.id}>
        <div className={`project-side-bar ${projectSidebar ? 'project-side-bar__expanded' : ''}`}>
          <NavLink
            className='project-side-bar-item'
            to={linkCreator.workspaces({
              workspaceId: workspace?.id + '',
              slug: workspace?.slug,
              ownerShip: workspace?.context
            })}
          >
            <i className='fa-solid fa-layer-group'></i> {workspace?.name}
          </NavLink>
          {workspace?.projects?.map(item => (
            <ProjectSideBarItem key={item.id} item={item} />
          ))}
        </div>
      </LoadingLayout>
    </>
  )
}

export default ProjectSideBar
