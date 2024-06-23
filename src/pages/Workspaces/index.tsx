import { WorkspaceResponseWithRelatedProjects } from '@utils/types'
import { AxiosResponse } from 'axios'
import { useEffect } from 'react'
import { useLoaderData } from 'react-router-dom'
import './Workspaces.scss'
import ProjectCard from './partials/ProjectCard'
import { useDispatch } from 'react-redux'
import { workspaceSlice } from '@redux/WorkspaceSlice'
import WorkspaceHeader from './partials/WorkspaceHeader'

// type WorkspaceParams = {
//   ownership: string
//   slug: string
//   workspaceId: string
// }

function Workspaces() {
  // const routeParams = useParams<WorkspaceParams>()
  const dispatch = useDispatch()

  const res = useLoaderData() as AxiosResponse
  const workspace = res?.data as WorkspaceResponseWithRelatedProjects

  // đặt activeWorkspace (workspace đang thao tác)
  useEffect(() => {
    dispatch(workspaceSlice.actions.setActiveWorkspace(workspace))
  }, [dispatch, workspace])

  return (
    <>
      <div className='workspaces-container'>
        <WorkspaceHeader workspace={workspace} />
        <div className='card-list project-list'>
          {workspace?.projects?.map(project => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>
    </>
  )
}

export default Workspaces
