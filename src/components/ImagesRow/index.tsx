import Flex from '@comps/StyledComponents/Flex'
import { RootState } from '@redux/store'
import { AssignmentResponse } from '@utils/types/assignment.type'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import './ImagesRow.scss'

function ImagesRow({ ids, imageWidth, displayCount }: { ids?: string[]; imageWidth?: string; displayCount?: number }) {
  const members = useSelector((state: RootState) => state.project.activeProject.members)
  const [taskMembers, setTaskMembers] = useState<AssignmentResponse[]>([])
  useEffect(() => {
    setTaskMembers(members?.filter(m => ids?.includes(m.id)))
  }, [ids, members])
  return (
    <>
      <Flex $alignItem='center' $flexDirection='row-reverse' className='avatar-stack'>
        {taskMembers?.map((t, index) => {
          if (index > (displayCount ?? 1) - 1) return
          return (
            <>
              <img style={{ '--img-w': imageWidth } as React.CSSProperties} src={t?.avatar} alt='avatar' />
            </>
          )
        })}
      </Flex>
    </>
  )
}

export default ImagesRow
