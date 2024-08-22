import Button from '@comps/Button'
import './AddNewList.scss'
import { useEffect, useRef, useState } from 'react'
import Flex from '@comps/StyledComponents/Flex'
import FloatLabelInput from '@comps/FloatLabelInput'
import { InputChange } from '@utils/types'
import useClickTracker from '@hooks/useClickTracker'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@redux/store'
import { projectSlice } from '@redux/ProjectSlice'
import { hubs, ProjectHub } from '@utils/Hubs'
import { createList } from '@services/list.services'
import { containsSpecialCharacters, handleTriggerKeyPress } from '@utils/functions'
import { useProjectSelector } from '@hooks/useProjectSelector'
import { CreateListModel } from '@utils/types/list.type'

function AddNewList() {
  const [isAddingList, setIsAddingList] = useState(false)
  const { board } = useProjectSelector()
  const handleToggleAddNewList = () => {
    setIsAddingList(!isAddingList)
  }
  const permission = board.context.toLowerCase()
  const canCreate = permission === 'admin' || permission === 'owner'
  if (!canCreate) return <></>
  return (
    <>
      {!isAddingList ? (
        <Button
          onClick={handleToggleAddNewList}
          variant='text'
          theme='default'
          size='large'
          style={{ fontSize: '1.1rem', minWidth: 'max-content' }}
        >
          <i className='fa-solid fa-plus'></i> Add new list ...
        </Button>
      ) : (
        <AddNewListInput onCancel={handleToggleAddNewList} />
      )}
    </>
  )
}

function AddNewListInput({ onCancel }: { onCancel: () => void }) {
  const activeProject = useSelector((state: RootState) => state.project.activeProject.board)
  const dispatch = useDispatch()
  const [listName, setListName] = useState('')
  const containerRef = useRef<HTMLDivElement>(null)
  const { outClick } = useClickTracker(containerRef?.current as HTMLElement)
  const [projectHub] = useState<ProjectHub>(new ProjectHub())
  const [error, setError] = useState('')
  const handleChangeListName = (e: InputChange) => {
    setListName(e.target.value)
  }
  useEffect(() => {
    if (outClick.isOutClick) {
      onCancel()
    }
  }, [onCancel, outClick])
  const handleSubmit = async () => {
    if (!listName.trim()) {
      setError('Please enter a name')
      return
    } else if (containsSpecialCharacters(listName)) {
      setError('List name cannot contain special characters')
      return
    }
    const postData: CreateListModel = {
      name: listName,
      projectId: activeProject.id
    }
    const res = await createList(postData)
    if (res?.isSuccess) {
      onCancel()
      // cập nhật lại list của project
      const data = res.data
      dispatch(projectSlice.actions.addNewList(data))
      if (projectHub.isConnected) {
        projectHub.connection?.invoke(hubs.project.send.addNewList, data)
      }
    } else {
      console.log('Can not create list')
    }
  }

  const handleTrigger = handleTriggerKeyPress(() => {
    handleSubmit()
  }, 'Enter')
  return (
    <>
      <div ref={containerRef} className='add-new-list-input-container'>
        <Flex $flexDirection='column' $gap='0.5rem'>
          <FloatLabelInput
            onChange={handleChangeListName}
            label='List name'
            input={{ id: 'add-new-list-input', value: listName, autoFocus: true, onKeyDown: handleTrigger.handler }}
            style={{ width: '100%', fontSize: '1.1rem' }}
          />
          {error && <p className='text-danger'>{error}</p>}
          <Flex $alignItem='center' $gap='0.5rem'>
            <Button onClick={handleSubmit} variant='filled'>
              Add list
            </Button>
            <Button variant='text' theme='default' onClick={onCancel}>
              <i className='fa-solid fa-xmark'></i>
            </Button>
          </Flex>
        </Flex>
      </div>
    </>
  )
}

export default AddNewList
