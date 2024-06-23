import Button from '@comps/Button'
import './AddNewList.scss'
import { useEffect, useRef, useState } from 'react'
import Flex from '@comps/StyledComponents/Flex'
import FloatLabelInput from '@comps/FloatLabelInput'
import { InputChange } from '@utils/types'
import useClickTracker from '@hooks/useClickTracker'

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
  const [listName, setListName] = useState('')
  const handleChangeListName = (e: InputChange) => {
    setListName(e.target.value)
  }
  const containerRef = useRef<HTMLDivElement>(null)
  const { outClick } = useClickTracker(containerRef?.current as HTMLElement)
  useEffect(() => {
    if (outClick.isOutClick) {
      onCancel()
    }
  }, [onCancel, outClick])
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
            <Button variant='filled'>Add list</Button>
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
