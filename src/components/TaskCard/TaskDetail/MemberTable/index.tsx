import Button from '@comps/Button'
import './MemberTable.scss'
import Flex from '@comps/StyledComponents/Flex'
import { useContext, useState } from 'react'
import { TaskDetailContext } from '@comps/TaskCard'
import { useSelector } from 'react-redux'
import { RootState } from '@redux/store'

function MemberTable() {
  const taskDetail = useContext(TaskDetailContext)?.taskDetail
  const projectMembers = useSelector((state: RootState) => state.project.activeProject.members)
  const [taskMembers] = useState(() => projectMembers.filter(m => taskDetail?.taskAssignmentIds?.includes(m.id)))
  return (
    <>
      <p className='mb-1 text-primary'>Task member</p>
      <Flex
        $alignItem='center'
        $flexDirection='column'
        $gap='0.5rem'
        style={{ marginTop: '0.5rem', padding: '0 0.25rem' }}
      >
        {taskMembers?.map(tm => {
          return (
            <>
              <div className='member-info'>
                <Flex $alignItem='center' $gap='1rem'>
                  <img src={tm.avatar} alt='avatar' />
                  <div>
                    <p className='member-info-title'>
                      {tm?.email} ({tm.displayName})
                    </p>
                    <p className='member-info-role'>{tm.permission}</p>
                  </div>
                </Flex>
                <Button theme='danger'>
                  <i className='fa-regular fa-trash-can'></i>
                </Button>
              </div>
            </>
          )
        })}
      </Flex>
    </>
  )
}

export default MemberTable
