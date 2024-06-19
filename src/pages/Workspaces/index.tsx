import Flex from '@comps/StyledComponents/Flex'
import { Workspace } from '@utils/types'
import { AxiosResponse } from 'axios'
import { useState } from 'react'
import { useLoaderData, useParams } from 'react-router-dom'
import './Workspaces.scss'
import Button from '@comps/Button'
import ProjectCard from './partials/ProjectCard'

type WorkspaceParams = {
  ownership: string
  slug: string
  workspaceId: string
}

function Workspaces() {
  // const routeParams = useParams<WorkspaceParams>()
  const res = useLoaderData() as AxiosResponse
  const workspace = res?.data?.data as Workspace
  const [workspaceNameState, setWorkspaceNameState] = useState({
    name: workspace?.name,
    isEditing: false,
    tempName: workspace?.name
  })
  // if (!res || res.status !== 200 || !res.data.data.status) console.log(res)
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
              <button className='edit-workspace-name-buton save-button'>
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
