import { TaskResponseForBoard } from '@utils/types'
import './DuplicateTask.scss'
import Flex from '@comps/StyledComponents/Flex'
import SwitchButton from '@comps/SwitchButton'
import PriorityTag from '@comps/TaskCard/PriorityTag'
import Button from '@comps/Button'
import { useState } from 'react'
import FloatLabelInput from '@comps/FloatLabelInput'
import HttpClient from '@utils/HttpClient'
import { HttpStatusCode } from 'axios'
import { useDispatch } from 'react-redux'
import { projectSlice } from '@redux/ProjectSlice'

export type InheritOptions = {
  priority?: boolean
  dueDate?: boolean
  description?: boolean
  duplicateTaskCount?: number
}

const http = new HttpClient()

function DuplicateTask({ task, onCloseModal = () => {} }: { task?: TaskResponseForBoard; onCloseModal?: () => void }) {
  const [inheritOptions, setInheritOptions] = useState<InheritOptions>({
    priority: true,
    description: true,
    dueDate: true,
    duplicateTaskCount: 1
  })
  const dispatch = useDispatch()
  const handleCheckOptions = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInheritOptions({ ...inheritOptions, [e.target.name]: e.target.checked })
  }
  const handleChangeDuplicateCount = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInheritOptions({ ...inheritOptions, duplicateTaskCount: parseInt(e.target.value) })
  }
  const handleDuplicateTask = async () => {
    // Duplicate task logic goes here
    const res = await http.postAuth(`/tasks/${task?.id}/duplicate`, inheritOptions)
    if (res?.status === HttpStatusCode.Ok) {
      // console.log(res.data)
      dispatch(projectSlice.actions.setDuplicateTasks(res?.data))
      onCloseModal()
    }
    onCloseModal()
  }
  return (
    <>
      <p className='duplicate-task-name'>{task?.name}</p>
      <div className='duplicate-options'>
        <Flex $alignItem='center' $gap='0.5rem' className='duplicate-options-item'>
          <SwitchButton
            inputAttributes={{
              id: 'inherit-checkbox-priority',
              name: 'priority',
              type: 'checkbox',
              checked: inheritOptions.priority
            }}
            icon={{
              checked: <i className='fa-solid fa-link'></i>,
              unchecked: <i className='fa-solid fa-link-slash'></i>
            }}
            onChange={handleCheckOptions}
          />
          <label htmlFor='inherit-checkbox-priority'>
            Inherit task priority <PriorityTag priority={task?.priority} />
          </label>
        </Flex>
        <Flex $alignItem='center' $gap='0.5rem' className='duplicate-options-item'>
          <SwitchButton
            inputAttributes={{
              id: 'inherit-checkbox-duedate',
              name: 'dueDate',
              type: 'checkbox',
              checked: inheritOptions.dueDate
            }}
            icon={{
              checked: <i className='fa-solid fa-link'></i>,
              unchecked: <i className='fa-solid fa-link-slash'></i>
            }}
            onChange={handleCheckOptions}
          />
          <label htmlFor='inherit-checkbox-duedate'>
            Inherit task due date{' '}
            <span>
              {task?.dueDate ? (
                <>{new Date(task?.dueDate).toLocaleDateString()}</>
              ) : (
                <span className='text-light'>[Not set]</span>
              )}
            </span>
          </label>
        </Flex>
        <Flex $alignItem='center' $flexWrap='wrap' $gap='0.5rem' className='duplicate-options-item'>
          <SwitchButton
            inputAttributes={{
              id: 'inherit-checkbox-description',
              type: 'checkbox',
              checked: inheritOptions.description,
              name: 'description'
            }}
            icon={{
              checked: <i className='fa-solid fa-link'></i>,
              unchecked: <i className='fa-solid fa-link-slash'></i>
            }}
            onChange={handleCheckOptions}
          />
          <label htmlFor='inherit-checkbox-description'>Inherit task description</label>
          <p className='w-full duplicate-description-preview'>{task?.description ?? '[ No description ]'}</p>
        </Flex>
        <FloatLabelInput
          label='Duplicate task count'
          className='mb-1'
          input={{
            id: 'duplicate-task-count',
            autoFocus: true,
            type: 'number',
            value: inheritOptions.duplicateTaskCount
          }}
          onChange={handleChangeDuplicateCount}
        />
        <Flex $alignItem='center' $justifyContent='end' $gap='1rem'>
          <Button onClick={onCloseModal} size='large' theme='danger'>
            <i className='fa-solid fa-xmark'></i> Cancel
          </Button>
          <Button onClick={handleDuplicateTask} size='large' theme='success'>
            <i className='fa-regular fa-clone'></i> Duplicate
          </Button>
        </Flex>
      </div>
    </>
  )
}

export default DuplicateTask
