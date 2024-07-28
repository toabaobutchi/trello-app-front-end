import Modal from '@comps/Modal'
import Tooltip from '@comps/Tooltip-v2'
import { useModal } from '@hooks/useModal'
import { RootState } from '@redux/store'
import { AssignmentResponse } from '@utils/types'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import SubtaskMemberSelectorMenu from './SubtaskMemberSelectorMenu'

function SubtaskMemberSelector({ assignmentId }: { assignmentId?: string }) {
  const projectMembers = useSelector((state: RootState) => state.project.activeProject.members)
  const [assignment, setAssignment] = useState<AssignmentResponse>()
  const [subtaskAssignmentModal, handleToggleSubtaskAssignmentModal] = useModal()

  useEffect(() => {
    setAssignment(projectMembers.find(m => m.id === assignmentId))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [assignmentId])

  const tooltipContent = !assignment
    ? 'No member has assigned this subtask yet!'
    : `${assignment?.email} (${assignment?.displayName})`

  const handleSelectSubtaskAssignment = (selectedAssignmentId: string) => {
    console.log('selectedAssignmentId', selectedAssignmentId)
  }

  return (
    <>
      <Tooltip arrow delay='0.25s' content={tooltipContent}>
        <div className='subtasks-item-icon' onClick={handleToggleSubtaskAssignmentModal}>
          {!assignment ? (
            <i className='fa-regular fa-user'></i>
          ) : (
            <>
              <img className='subtasks-item-asignment-avatar' src={assignment?.avatar} />
            </>
          )}
        </div>
      </Tooltip>
      <Modal
        layout={{ header: { title: 'Assign/Join to subtask', closeIcon: true } }}
        style={{ width: '35%' }}
        open={subtaskAssignmentModal}
        onClose={handleToggleSubtaskAssignmentModal}
        className='subtask-assignment-modal'
      >
        <SubtaskMemberSelectorMenu onSelect={handleSelectSubtaskAssignment} />
      </Modal>
    </>
  )
}

export default SubtaskMemberSelector
