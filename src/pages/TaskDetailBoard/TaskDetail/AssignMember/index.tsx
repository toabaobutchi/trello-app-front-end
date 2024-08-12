import Button from '@comps/Button'
import Flex from '@comps/StyledComponents/Flex'
import { useProjectSelector } from '@hooks/useProjectSelector'
import { AssignByTaskModel, TaskDetailForBoard, TaskResponseForTable } from '@utils/types'
import { useContext, useMemo, useState } from 'react'
import './AssignMember.scss'
import AssignmentMemberItem from './AssignmentMemberItem'
import { useDispatch } from 'react-redux'
import { projectSlice } from '@redux/ProjectSlice'
import { TaskDetailContext } from '@pages/TaskDetailBoard/context'
import { hubs, ProjectHub } from '@utils/Hubs'
import { assignMembersToTask } from '@services/assignment.services'

type AssignMemberProps = {
  task: TaskDetailForBoard | TaskResponseForTable
  onCloseModal?: () => void
}
type SelectedMember = {
  id: string
  isSelected?: boolean
}

function AssignMember({ task, onCloseModal = () => {} }: AssignMemberProps) {
  const { members, board } = useProjectSelector()

  // tìm các thành viên còn lại - trừ người đang thực hiện
  const restMembers = useMemo(() => {
    return members.filter(m => !task.taskAssignmentIds?.includes(m.id) && m.id !== board.assignmentId)
  }, [members, task.taskAssignmentIds, board.assignmentId])

  const [selectedMembers, setSelectedMembers] = useState<SelectedMember[]>([])
  const dispatch = useDispatch()
  const context = useContext(TaskDetailContext)
  const [projectHub] = useState(new ProjectHub())

  const handleSelectMembers = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedMemberId = e.target.value
    const isSelected = e.target.checked
    setSelectedMembers(prev => {
      const newSelectedMembers = [...prev]
      const selectedMember = newSelectedMembers.find(m => m.id === selectedMemberId)
      if (selectedMember) {
        selectedMember.isSelected = isSelected
      } else {
        newSelectedMembers.push({ id: selectedMemberId, isSelected })
      }
      return newSelectedMembers
    })
  }
  const handleAssignMembers = async () => {
    const selectedMemberIds = selectedMembers.filter(m => m.isSelected).map(m => m.id)

    if (selectedMemberIds?.length > 0) {
      // call API
      const model: AssignByTaskModel = {
        assignmentIds: selectedMemberIds
      }
      const res = await assignMembersToTask(task.id, model)
      if (res?.isSuccess) {
        const data = res.data
        dispatch(projectSlice.actions.addAssignmentToTask(data))
        context?.setTask?.(
          prev => ({ ...prev, taskAssignmentIds: prev?.taskAssignmentIds?.concat(data.assignmentIds) } as typeof prev)
        )
        // send notification to others
        if (projectHub.isConnected) {
          projectHub.connection?.invoke(hubs.project.send.assignMemberToTask, data)
        }
      }
    }
    onCloseModal()
  }
  return (
    <>
      <div className='assignees-container'>
        {restMembers.length > 0 ? (
          <>
            <p className='mb-1'>
              Select member that will be assigned to task <span className='text-primary bolder'>{task.name}</span>
            </p>
            {restMembers.map(member => (
              <AssignmentMemberItem key={member.id} member={member} onSelect={handleSelectMembers} />
            ))}
          </>
        ) : (
          <p className='text-warning'>No member available!</p>
        )}
        {restMembers.length > 0 && (
          <Flex $alignItem='center' $justifyContent='end' className='mt-1'>
            <Button onClick={handleAssignMembers} variant='filled'>
              Assign
            </Button>
          </Flex>
        )}
      </div>
    </>
  )
}

export default AssignMember
