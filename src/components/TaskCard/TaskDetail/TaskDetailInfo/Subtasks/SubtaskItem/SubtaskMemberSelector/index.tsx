import Menu from '@comps/Menu'
import MenuItem from '@comps/MenuItem'
import Tooltip from '@comps/Tooltip'
import useMenu from '@hooks/useMenu'
import { RootState } from '@redux/store'
import { AssignmentResponse } from '@utils/types'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

function SubtaskMemberSelector({ assignmentId }: { assignmentId?: string }) {
  const menu = useMenu<HTMLDivElement>()
  const projectMembers = useSelector((state: RootState) => state.project.activeProject.members)
  const [assignment, setAssignment] = useState<AssignmentResponse>()
  // Sử dụng modal
  useEffect(() => {
    setAssignment(projectMembers.find(m => m.id === assignmentId))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [assignmentId])
  console.log({ data: menu.anchorRef.current })
  return (
    <>
      <div ref={menu.anchorRef} onClick={menu.toggleMenu}>
        <div className='subtasks-item-icon'>
          {!assignment ? (
            <i className='fa-regular fa-user'></i>
          ) : (
            <>
              <Tooltip arrow position='top' content={`${assignment?.email} (${assignment?.displayName})`}>
                <img className='' src={assignment?.avatar} />
              </Tooltip>
            </>
          )}
        </div>
      </div>
      <Menu open={menu.open} anchorElement={menu.anchorRef.current} onClose={menu.closeMenu}>
        {projectMembers.map(ta => {
          return (
            <MenuItem size='small' style={{ fontSize: '0.9rem' }} key={ta.id} className='row gap-1'>
              <img className='avatar-image-selector' src={ta.avatar} alt={ta.displayName} />
              <span>{ta.displayName}</span>
            </MenuItem>
          )
        })}
      </Menu>
    </>
  )
}

export default SubtaskMemberSelector
