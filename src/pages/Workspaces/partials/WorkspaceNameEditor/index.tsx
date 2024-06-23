import { useEffect, useState } from 'react'
import './WorkspaceNameEditor.scss'
import { Workspace, WorkspaceResponseWithRelatedProjects } from '@utils/types'
import HttpClient from '@utils/HttpClient'
import { HttpStatusCode } from 'axios'
import { useDispatch } from 'react-redux'
import { workspaceSlice } from '@redux/WorkspaceSlice'
import Button from '@comps/Button'

const http = new HttpClient()

function WorkspaceNameEditor({ workspace }: { workspace: WorkspaceResponseWithRelatedProjects }) {
  const dispatch = useDispatch()
  const [workspaceNameState, setWorkspaceNameState] = useState({
    name: workspace?.name,
    isEditing: false,
    tempName: workspace?.name
  })
  useEffect(() => {
    setWorkspaceNameState({
      name: workspace?.name ?? '',
      isEditing: false,
      tempName: workspace?.name ?? ''
    })
  }, [workspace?.name])
  const handleChangeWorkspaceName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setWorkspaceNameState({ ...workspaceNameState, tempName: e.currentTarget.value, isEditing: true })
  }
  const handleToggleWorkspaceEditor = () => {
    setWorkspaceNameState({
      ...workspaceNameState,
      isEditing: !workspaceNameState?.isEditing,
      tempName: workspaceNameState?.name
    })
  }
  const handleChangeWorkspaceNameSubmit = async () => {
    if (!workspaceNameState.tempName) {
      console.error('Workspace name is empty')
    } else {
      const res = await http.putAuth(`/workspaces/${workspace.id}`, { name: workspaceNameState?.tempName })
      if (res?.status === HttpStatusCode.Ok) {
        // thanh cong
        const updatedWorkspace = res.data as Workspace
        setWorkspaceNameState({ ...workspaceNameState, name: updatedWorkspace.name, isEditing: false })
        // cập nhật lại store - workspaceList
        dispatch(
          workspaceSlice.actions.renameWorkspace({ workspaceId: workspace.id, workspaceName: updatedWorkspace.name })
        )

        // cập nhật lại activeWorkspace
        dispatch(
          workspaceSlice.actions.renameActiveWorkspace({
            workspaceId: workspace.id,
            workspaceName: updatedWorkspace.name
          })
        )
      } else if (res?.status === HttpStatusCode.NotModified) {
        console.log('Nothing to update')
      }
    }
  }
  const handleCaptureEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleChangeWorkspaceNameSubmit()
    }
  }
  return (
    <>
      <i className='fa-solid fa-layer-group'></i>
      {!workspaceNameState.isEditing ? (
        <p className='workspace-name-text'>{workspaceNameState?.name}</p>
      ) : (
        <input
          type='text'
          id='workspace-name-edit-input'
          value={workspaceNameState?.tempName}
          onChange={handleChangeWorkspaceName}
          onKeyDown={handleCaptureEnter}
        />
      )}

      {!workspaceNameState.isEditing ? (
        <button className='edit-workspace-name-buton' onClick={handleToggleWorkspaceEditor}>
          <i className='fa-regular fa-pen-to-square'></i>
        </button>
      ) : (
        <>
          <Button onClick={handleToggleWorkspaceEditor} size='small' variant='outlined' theme='light' className='text-danger'>
            <i className='fa-solid fa-arrow-rotate-left'></i>
          </Button>
        </>
      )}
    </>
  )
}

export default WorkspaceNameEditor
