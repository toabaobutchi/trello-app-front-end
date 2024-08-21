import Tab, { TabNav } from '@comps/Tab'
import './SubtaskMemberSelectorMenu.scss'
import { useContext, useEffect, useState } from 'react'
import { TaskDetailContext } from '@pages/TaskDetailBoard/context'
import { AssignmentResponse } from '@utils/types/assignment.type'
import { useProjectSelector } from '@hooks/useProjectSelector'
import { getRestAssignments, getTaskAssignments } from '@utils/functions'
import Flex from '@comps/StyledComponents'
import Button from '@comps/Button'

type SubtaskMemberSelectorMenuProps = {
  onSelect?: (selectedAssignmentId: string) => void
  onJoin?: () => void
}

const tabs: TabNav[] = [
  {
    value: 'task-members',
    display: 'Task members'
  },
  {
    value: 'project-members',
    display: 'Project members'
  }
]

const initTab = 'task-members'

function SubtaskMemberSelectorMenu({ onSelect = () => {}, onJoin = () => {} }: SubtaskMemberSelectorMenuProps) {
  const context = useContext(TaskDetailContext)
  const { members } = useProjectSelector()
  const [taskMembers, setTaskMembers] = useState<AssignmentResponse[]>([])
  const [restMembers, setRestMembers] = useState<AssignmentResponse[]>([])
  const [selectedAssignmentId, setSelectedAssignmentId] = useState('')
  const [activeTab, setActiveTab] = useState(initTab)

  useEffect(() => {
    setTaskMembers(getTaskAssignments(context?.task?.taskAssignmentIds, members))
    setRestMembers(getRestAssignments(context?.task?.taskAssignmentIds, members))
  }, [members, context?.task?.taskAssignmentIds])

  const handleTabClick = (tabValue: string) => {
    setActiveTab(tabValue)
  }
  const handleSelectAssignment = (assignmentId: string) => {
    setSelectedAssignmentId(assignmentId)
  }
  const handleConfirmAssignMemberToSubtask = () => {
    onSelect(selectedAssignmentId)
  }
  const handleJoinSubtask = () => {
    onJoin()
  }
  return (
    <>
      <div className='subtask-assignment-selector-menu'></div>
      <Tab tabs={tabs} activeTab={activeTab} onTabClick={handleTabClick}>
        <Tab.Content show={activeTab === tabs[0].value}>
          {taskMembers?.map(item => (
            <SubtaskAssignmentItem
              key={item.id}
              onSelect={handleSelectAssignment}
              assignment={item}
              selected={selectedAssignmentId === item.id}
            />
          ))}
        </Tab.Content>
        <Tab.Content show={activeTab === tabs[1].value}>
          {restMembers?.map(item => (
            <SubtaskAssignmentItem
              key={item.id}
              onSelect={handleSelectAssignment}
              assignment={item}
              selected={selectedAssignmentId === item.id}
            />
          ))}
        </Tab.Content>
      </Tab>

      <Flex $alignItem='center' $justifyContent='end' $gap='0.5rem'>
        <Button onClick={handleJoinSubtask} variant='filled' theme='success'>
          Join
        </Button>
        <Button onClick={handleConfirmAssignMemberToSubtask} variant='filled' disabled={!selectedAssignmentId}>
          Assign
        </Button>
      </Flex>
    </>
  )
}

type SubtaskAssignmentItemProps = {
  assignment: AssignmentResponse
  selected?: boolean
  onSelect?: (selectedAssignmentId: string) => void
}

function SubtaskAssignmentItem({ assignment, onSelect = () => {}, selected = false }: SubtaskAssignmentItemProps) {
  const handleChangeAssignment = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSelect(e.target.value)
  }
  return (
    <>
      <div className='subtask-assignment-item mb-1'>
        <input
          type='radio'
          checked={selected}
          name='subtaskAssignmentItem'
          value={assignment.id}
          id={`subtask-assignment-item-${assignment.id}`}
          onChange={handleChangeAssignment}
        />
        <label htmlFor={`subtask-assignment-item-${assignment.id}`} className='row jcsb w-full'>
          <div className='row gap-1'>
            <img src={assignment.avatar} alt='avatar' className='subtask-assignment-item-avatar' />
            <div className='subtask-assignment-item-info'>
              <p className='subtask-assignment-item-info-name'>{assignment.displayName}</p>
              <p className='subtask-assignment-item-info-email'>{assignment.email}</p>
            </div>
          </div>
          {selected && (
            <div className='text-success bold'>
              Selected
              <i className='fa-solid fa-check fa-fw'></i>
            </div>
          )}
        </label>
      </div>
    </>
  )
}

export default SubtaskMemberSelectorMenu
