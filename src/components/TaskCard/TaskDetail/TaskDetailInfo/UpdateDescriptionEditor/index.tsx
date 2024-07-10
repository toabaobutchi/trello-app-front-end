import Button from '@comps/Button'
import Flex from '@comps/StyledComponents/Flex'
import { useState } from 'react'
import './UpdateDescriptionEditor.scss'
import Tooltip from '@comps/Tooltip-v2'
import { useSelector } from 'react-redux'
import { RootState } from '@redux/store'
import { TaskDetailForBoard } from '@utils/types'
import { HubConnection } from '@microsoft/signalr'

type UpdateDescriptionEditorProps = {
  task?: TaskDetailForBoard
  hubConnection?: HubConnection
  onUpdate?: (desc: string) => void
}

function UpdateDescriptionEditor({ hubConnection, task, onUpdate = () => {} }: UpdateDescriptionEditorProps) {
  const [updateDescription, setUpdateDescription] = useState<string>()
  const projectId = useSelector((state: RootState) => state.project.activeProject.board.id)
  const accountId = useSelector((state: RootState) => state.login.accountInfo.id)
  const handleToggle = () => {
    setUpdateDescription(updateDescription !== undefined ? undefined : task?.description ?? '')
    if (hubConnection) {
      if (updateDescription === undefined) {
        hubConnection.invoke('SendStartUpdateTaskInfo', projectId, accountId, task?.id)
      } else hubConnection.invoke('SendCancelUpdateTaskInfo', projectId, accountId, task?.id)
    }
  }
  const handleClear = () => {
    setUpdateDescription('')
  }
  const handleChangeDescription = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setUpdateDescription(e.target.value)
  }
  const handleSave = () => {
    if (updateDescription) {
      onUpdate(updateDescription)
      setUpdateDescription(undefined)
    }
  }
  return (
    <>
      {updateDescription === undefined && (
        <Flex $alignItem='center' $gap='0.5rem'>
          <p>{task?.description}</p>
          <Button size='small' onClick={handleToggle}>
            <i className='fa-solid fa-pen-nib'></i> {task?.description ? 'Change' : 'Add'}
          </Button>
        </Flex>
      )}
      {updateDescription !== undefined && (
        <div className='w-full posr' style={{ flex: 1 }}>
          <textarea
            id='task-details-description-input'
            onChange={handleChangeDescription}
            style={{ padding: '1rem' }}
            rows={5}
            value={updateDescription}
            className='w-full'
          ></textarea>

          <div className='editor-tools row'>
            <Tooltip arrow content='Clear'>
              <Button onClick={handleClear} variant='text' theme='danger'>
                <i className='fa-solid fa-delete-left'></i>
              </Button>
            </Tooltip>
            <Tooltip arrow content='Save changes'>
              <Button onClick={handleSave} variant='text' theme='success'>
                <i className='fa-regular fa-floppy-disk'></i>
              </Button>
            </Tooltip>
            <Tooltip arrow content='Cancel'>
              <Button onClick={handleToggle} variant='text'>
                <i className='fa-solid fa-xmark'></i>
              </Button>
            </Tooltip>
          </div>
        </div>
      )}
    </>
  )
}

export default UpdateDescriptionEditor
