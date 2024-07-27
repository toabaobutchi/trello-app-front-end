import Button from '@comps/Button'
import './AddNewList.scss'
import { useEffect, useRef, useState } from 'react'
import Flex from '@comps/StyledComponents/Flex'
import FloatLabelInput from '@comps/FloatLabelInput'
import { CreateListModel, InputChange } from '@utils/types'
import useClickTracker from '@hooks/useClickTracker'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@redux/store'
import { projectSlice } from '@redux/ProjectSlice'
import { hubs, ProjectHub } from '@utils/Hubs'
import { createList } from '@services/list.services'

function AddNewList() {
  const [isAddingList, setIsAddingList] = useState(false)
  const handleToggleAddNewList = () => {
    setIsAddingList(!isAddingList)
  }
  return (
    <>
      {!isAddingList ? (
        <Button
          onClick={handleToggleAddNewList}
          variant='text'
          theme='default'
          size='large'
          style={{ fontSize: '1.1rem' }}
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
  const handleChangeListName = (e: InputChange) => {
    setListName(e.target.value)
  }
  useEffect(() => {
    if (outClick.isOutClick) {
      onCancel()
    }
  }, [onCancel, outClick])
  const handleSubmit = async () => {
    if (!listName) {
      console.log('Please enter a list name')
      return
    }
    const postData: CreateListModel = {
      name: listName,
      projectId: activeProject.id
    }
    // const res = await http.postAuth('/lists', postData)
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
  return (
    <>
      <div ref={containerRef} className='add-new-list-input-container'>
        <Flex $flexDirection='column' $gap='0.5rem'>
          <FloatLabelInput
            onChange={handleChangeListName}
            label='List name'
            input={{ id: 'add-new-list-input', value: listName, autoFocus: true }}
            style={{ width: '100%', fontSize: '1.1rem' }}
          />
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
