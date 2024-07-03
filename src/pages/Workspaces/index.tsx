import { WorkspaceResponseWithRelatedProjects } from '@utils/types'
import { AxiosResponse } from 'axios'
import { useEffect } from 'react'
import { useLoaderData } from 'react-router-dom'
import './Workspaces.scss'
import ProjectCard from './partials/ProjectCard'
import { useDispatch } from 'react-redux'
import { workspaceSlice } from '@redux/WorkspaceSlice'
import WorkspaceHeader from './partials/WorkspaceHeader'
import emptyWorkspaceImage from '@assets/empty-workspace.svg'
import Flex from '@comps/StyledComponents/Flex'
import Button from '@comps/Button'

function Workspaces() {
  // const routeParams = useParams<WorkspaceParams>()
  const dispatch = useDispatch()

  const res = useLoaderData() as AxiosResponse
  const workspace = res?.data as WorkspaceResponseWithRelatedProjects

  // đặt activeWorkspace (workspace đang thao tác)
  useEffect(() => {
    console.log(workspace)
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
        {workspace?.projects?.length <= 0 && (
          <>
            <Flex $alignItem='center' $justifyContent='center' $flexDirection='column'>
              <img className='empty-workspace-image' src={emptyWorkspaceImage} alt='empty workspace image' />
              <Button variant='filled' size='large'>
                Create your first project
              </Button>
            </Flex>
          </>
        )}
      </div>
    </>
  )
}

export default Workspaces
