import { TaskDetailForBoard } from '@utils/types'
import './DuplicateTask.scss'
import Flex from '@comps/StyledComponents/Flex'
import SwitchButton from '@comps/SwitchButton'
import PriorityTag from '@comps/TaskCard/PriorityTag'
import Button from '@comps/Button'
import { useState } from 'react'
import FloatLabelInput from '@comps/FloatLabelInput'
import { useDispatch } from 'react-redux'
import { projectSlice } from '@redux/ProjectSlice'
import { duplicateTask } from '@services/task.services'
import SelectList from '@comps/SelectList'
import { useProjectSelector } from '@hooks/useProjectSelector'
import { getDateString } from '@utils/functions'
import { hubs, ProjectHub } from '@utils/Hubs'

export type InheritOptions = {
  priority?: boolean
  dueDate?: boolean
  description?: boolean
  duplicateTaskCount?: number
  listId?: string
}

function DuplicateTask({ task, onCloseModal = () => {} }: { task?: TaskDetailForBoard; onCloseModal?: () => void }) {
  const [inheritOptions, setInheritOptions] = useState<InheritOptions>({
    priority: true,
    description: true,
    dueDate: true,
    duplicateTaskCount: 1,
    listId: task?.listId
  })
  const dispatch = useDispatch()
  const { board } = useProjectSelector()
  const [projectHub] = useState(new ProjectHub())

  const isOverWip = () => {
    // lấy list từ task
    const initList = board.lists?.find(l => l.id === inheritOptions?.listId)
    if (initList) {
      return Boolean(
        initList?.wipLimit &&
          initList?.tasks?.length &&
          initList.wipLimit < initList.tasks.length + (inheritOptions.duplicateTaskCount ?? 1)
      )
    }
    return false
  }

  const handleCheckOptions = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInheritOptions({ ...inheritOptions, [e.target.name]: e.target.checked })
  }
  const handleChangeDuplicateCount = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInheritOptions({ ...inheritOptions, duplicateTaskCount: parseInt(e.target.value) })
  }
  const handleSelectList = ({ value }: { value: string }) => {
    setInheritOptions({ ...inheritOptions, listId: value })
  }
  const handleDuplicateTask = async () => {
    // Duplicate task logic goes here
    if (task?.id) {
      const res = await duplicateTask(task.id, inheritOptions)
      if (res?.isSuccess) {
        dispatch(projectSlice.actions.setDuplicateTasks(res.data))

        // gửi thông báo đến các thành viên khác
        if (projectHub.isConnected) {
          projectHub.connection?.invoke(hubs.project.send.duplicateTasks, res.data)
        }
        onCloseModal()
      }
      onCloseModal()
    }
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
                <>{getDateString(new Date(task?.dueDate))}</>
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
        <Flex $alignItem='center' $gap='0.25rem'>
          <p>Place in list </p>
          <SelectList
            size='small'
            className='duplicate-options-select-list'
            items={board.lists?.map(l => {
              return { value: l.id, display: l.name }
            })}
            selectedValue={inheritOptions.listId}
            onChoose={handleSelectList}
          />
        </Flex>
        {isOverWip() && (
          <p className='text-danger mt-1'>
            The duplicate count {inheritOptions.duplicateTaskCount} is violate WIP limit. Please try to decrease
            duplicate count or select another list to place in!
          </p>
        )}
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
