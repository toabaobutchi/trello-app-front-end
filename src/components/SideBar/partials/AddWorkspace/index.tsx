import { AppDispatch } from '@redux/store'
import { addWorkspace } from '@redux/WorkspaceSlice'
import { handleTriggerKeyPress } from '@utils/functions'
import { useState } from 'react'
import { useDispatch } from 'react-redux'

function AddWorkspace() {
  const [workspaceName, setWorkspaceName] = useState('')
  const handleChangeWorkspaceName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setWorkspaceName(e.target.value)
  }
  const dispatch = useDispatch<AppDispatch>()
  const handleSubmit = () => {
    if (workspaceName?.trim() !== '') {
      dispatch(addWorkspace({ name: workspaceName }))
    }
  }
  const triggerSubmit = handleTriggerKeyPress(() => {
    handleSubmit()
  }, 'Enter')
  return (
    <>
      <div className='note-text'>
        <p>You currently have no workspace</p>
        <div className='quick-input-action'>
          <label htmlFor='quick-create-workspace-input'>
            <i className='fa-solid fa-bolt-lightning'></i> Create your first workspace
          </label>
          <div className='input-button-group'>
            <input
              type='text'
              id='quick-create-workspace-input'
              placeholder=' '
              value={workspaceName}
              onChange={handleChangeWorkspaceName}
              onKeyDown={triggerSubmit.handler}
            />
            <button>
              <i className='fa-solid fa-plus'></i>
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default AddWorkspace
