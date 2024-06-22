import Flex from '@comps/StyledComponents/Flex'
import { Workspace, WorkspaceResponseWithRelatedProjects } from '@utils/types'
import { AxiosResponse, HttpStatusCode } from 'axios'
import { useEffect, useState } from 'react'
import { useLoaderData } from 'react-router-dom'
import './Workspaces.scss'
import ProjectCard from './partials/ProjectCard'
import { useDispatch } from 'react-redux'
import { workspaceSlice } from '@redux/WorkspaceSlice'
import HttpClient from '@utils/HttpClient'

// type WorkspaceParams = {
//   ownership: string
//   slug: string
//   workspaceId: string
// }

const http = new HttpClient()

function Workspaces() {
  // const routeParams = useParams<WorkspaceParams>()
  const dispatch = useDispatch()

  const res = useLoaderData() as AxiosResponse
  const workspace = res?.data as WorkspaceResponseWithRelatedProjects

  // đặt activeWorkspace (workspace đang thao tác)
  useEffect(() => {
    dispatch(workspaceSlice.actions.setActiveWorkspace(workspace))
  }, [dispatch, workspace])

  const [workspaceNameState, setWorkspaceNameState] = useState({
    name: workspace?.name,
    isEditing: false,
    tempName: workspace?.name
  })
  const handleChangeWorkspaceName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setWorkspaceNameState({ ...workspaceNameState, tempName: e.currentTarget.value, isEditing: true })
  }
  const handleToggleWorkspaceEditor = () => {
    setWorkspaceNameState({
      ...workspaceNameState,
      isEditing: !workspaceNameState.isEditing,
      tempName: workspaceNameState.name
    })
  }
  const handleChangeWorkspaceNameSubmit = async () => {
    if (!workspaceNameState.tempName) {
      console.error('Workspace name is empty')
    } else {
      const res = await http.putAuth(`/workspaces/${workspace.id}`, { name: workspaceNameState.tempName })
      if (res?.status === HttpStatusCode.Ok) {
        // thanh cong
        const updatedWorkspace = res.data as Workspace
        setWorkspaceNameState({ ...workspaceNameState, name: updatedWorkspace.name, isEditing: false })
        // tam thoi khong update ten workspace cua active workspace
      } else if (res?.status === HttpStatusCode.NotModified) {
        console.log('Nothing to update')
      }
    }
  }
  return (
    <>
      <div className='workspaces-container'>
        <Flex $alignItem='center' $gap='1rem' className='page-header workspace-header'>
          <i className='fa-solid fa-layer-group'></i>
          {!workspaceNameState.isEditing ? (
            <p className='workspace-name-text'>{workspaceNameState.name}</p>
          ) : (
            <input
              type='text'
              id='workspace-name-edit-input'
              value={workspaceNameState.tempName}
              onChange={handleChangeWorkspaceName}
            />
          )}

          {!workspaceNameState.isEditing ? (
            <button className='edit-workspace-name-buton' onClick={handleToggleWorkspaceEditor}>
              <i className='fa-regular fa-pen-to-square'></i>
            </button>
          ) : (
            <Flex $alignItem='center' className='action-button-group'>
              <button
                onClick={handleChangeWorkspaceNameSubmit}
                disabled={!workspaceNameState.tempName}
                className='edit-workspace-name-buton save-button'
              >
                <i className='fa-regular fa-floppy-disk'></i>
              </button>
              <button className='edit-workspace-name-buton cancel-button' onClick={handleToggleWorkspaceEditor}>
                <i className='fa-solid fa-arrow-rotate-left'></i>
              </button>
            </Flex>
          )}
        </Flex>
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
