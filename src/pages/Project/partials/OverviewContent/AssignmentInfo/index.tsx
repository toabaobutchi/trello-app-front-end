import { useProjectSelector } from '@hooks/useProjectSelector'
import AssignmentInfoItem from './AssignmentInfoItem'

function AssignmentInfo() {
  const { members } = useProjectSelector()
  return (
    <div className='overview-card assignment-info'>
      <p className='assignment-info-header'>Members</p>
      <div className='assignment-info-container'>
        {members.map(member => (
          <AssignmentInfoItem key={member.id} member={member} />
        ))}
      </div>
    </div>
  )
}

export default AssignmentInfo
