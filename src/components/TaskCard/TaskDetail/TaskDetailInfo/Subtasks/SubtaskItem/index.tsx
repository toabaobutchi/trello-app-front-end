import Flex from '@comps/StyledComponents/Flex'
import SubtaskMemberSelector from './SubtaskMemberSelector'
import { InputChange, SubtaskForBoard } from '@utils/types'
import useMenu from '@hooks/useMenu'
import Menu from '@comps/Menu'
import Button from '@comps/Button'
import { useState } from 'react'
import HttpClient from '@utils/HttpClient'
import { HttpStatusCode } from 'axios'

type SubtaskItemProps = {
  subTask: SubtaskForBoard
  onCheckSubTask?: (e: React.ChangeEvent<HTMLInputElement>) => void
  onDeleteSubtask?: (subTaskId: number) => void
  onChangeSubTaskName?: (subTaskId: number, subTaskName: string) => void
}

const http = new HttpClient()

function SubtaskItem({
  subTask,
  onCheckSubTask = () => {},
  onDeleteSubtask = () => {},
  onChangeSubTaskName = () => {}
}: SubtaskItemProps) {
  const menu = useMenu<HTMLSpanElement>()
  const [subtaskName, setSubtaskName] = useState<string>()
  const handleDeleteSubtask = () => {
    onDeleteSubtask(subTask.id)
  }
  const handleToggleChangeSubtaskName = () => {
    setSubtaskName(subtaskName !== undefined ? undefined : subTask.title)
  }
  const handleChangeSubtaskName = (e: InputChange) => {
    setSubtaskName(e.target.value)
  }
  const handleSubmitSubtaskName = async (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && subtaskName) {
      // submit
      const res = await http.putAuth(`/subtasks/${subTask.id}/change-name`, { name: subtaskName })
      if (res?.status === HttpStatusCode.Ok) {
        const updatedSubtaskName = res?.data
        onChangeSubTaskName(subTask.id, updatedSubtaskName)
      }
    }
  }
  return (
    <>
      <Flex key={subTask?.id} $alignItem='center' $justifyContent='space-between' className='subtasks-item'>
        <Flex $alignItem='center' $gap='0.5rem' className='subtasks-item-title'>
          <input
            type='checkbox'
            name='subtaskStatus'
            onChange={onCheckSubTask}
            checked={subTask?.isCompleted}
            id={`subtaskStatus-${subTask?.id}`}
          />
          {!subtaskName ? (
            <label htmlFor={`subtaskStatus-${subTask?.id}`}>{subTask?.title}</label>
          ) : (
            <>
              <input
                type='text'
                id='change-subtask-name-input'
                value={subtaskName}
                onChange={handleChangeSubtaskName}
                autoFocus
                onBlur={handleToggleChangeSubtaskName}
                onKeyDown={handleSubmitSubtaskName}
              />
            </>
          )}
        </Flex>
        <Flex $alignItem='center' $gap='1.5rem'>
          {/* update subtask name */}

          <span onClick={handleToggleChangeSubtaskName} className='subtasks-item-icon'>
            <i className='fa-regular fa-pen-to-square'></i>
          </span>

          <SubtaskMemberSelector assignmentId={subTask.assignmentId} />
          <span ref={menu.anchorRef} onClick={menu.toggleMenu} className='subtasks-item-icon'>
            <i className='fa-regular fa-trash-can'></i>
          </span>
          <Menu open={menu.open} onClose={menu.closeMenu} anchorElement={menu.anchorRef.current}>
            <Button onClick={handleDeleteSubtask} variant='filled' theme='danger'>
              <i className='fa-solid fa-trash-can'></i> Delete this subtask
            </Button>
          </Menu>
        </Flex>
      </Flex>
    </>
  )
}

export default SubtaskItem
