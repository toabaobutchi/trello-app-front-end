import { WorkspacePageParams, WorkspaceResponseWithRelatedProjects } from '@utils/types'
import { AxiosResponse } from 'axios'
import { useEffect, useState } from 'react'
import { useLoaderData, useParams } from 'react-router-dom'
import './Workspaces.scss'
import ProjectCard from './partials/ProjectCard'
import { useDispatch, useSelector } from 'react-redux'
import { workspaceSlice } from '@redux/WorkspaceSlice'
import WorkspaceHeader from './partials/WorkspaceHeader'
import emptyWorkspaceImage from '@assets/empty-workspace.svg'
import Flex from '@comps/StyledComponents/Flex'
import Button from '@comps/Button'
import CreateBoardModal from '@layouts/Header/partials/MainMenu/partials/AddItemMenu/partials/CreateBoardModal'
import { RootState } from '@redux/store'

function Workspaces() {
  const dispatch = useDispatch()

  const res = useLoaderData() as AxiosResponse
  const workspace = res?.data as WorkspaceResponseWithRelatedProjects
  const [projectModal, setProjectModal] = useState(false)
  const params = useParams() as WorkspacePageParams
  const activeWorkspace = useSelector((state: RootState) => state.workspaces.activeWorkspace)
  // đặt activeWorkspace (workspace đang thao tác)
  useEffect(() => {
    if (workspace?.id) dispatch(workspaceSlice.actions.setActiveWorkspace(workspace))
  }, [params.workspaceId, workspace?.id])

  const handleToggle = () => {
    setProjectModal(!projectModal)
  }

  return (
    <>
      <div className='workspaces-container page-slide'>
        <WorkspaceHeader workspace={workspace} />
        <div className='card-list project-list'>
          {activeWorkspace?.projects?.map(project => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
        {activeWorkspace?.projects?.length <= 0 && (
          <>
            <Flex $alignItem='center' $justifyContent='center' $flexDirection='column'>
              <img className='empty-workspace-image' src={emptyWorkspaceImage} alt='empty workspace image' />
              <Button onClick={handleToggle} variant='filled' size='large'>
                Create your first project
              </Button>
            </Flex>
          </>
        )}
      </div>
      <CreateBoardModal open={projectModal} onClose={handleToggle} />
    </>
  )
}

export default Workspaces
