import Menu from '@comps/Menu'
import MenuItem from '@comps/MenuItem'
import useMenu from '@hooks/useMenu'

function SubtaskMemberSelector({ assignmentId }: { assignmentId?: string }) {
  const menu = useMenu<HTMLDivElement>()
  // Sử dụng modal
  return (
    <>
      <div className='subtasks-item-icon' ref={menu.anchorRef} onClick={menu.toggleMenu}>
        <i className='fa-regular fa-user'></i>
      </div>
      {/* <Menu open={menu.open} anchorElement={menu.anchorRef.current} onClose={menu.closeMenu}>
        {taskAssignments.map(ta => {
          return (
            <MenuItem size='small' style={{ fontSize: '0.9rem' }} key={ta.id} className='row gap-1'>
              <img className='avatar-image-selector' src={ta.avatarUrl} alt={ta.displayName} />
              <span>{ta.displayName}</span>
            </MenuItem>
          )
        })}
      </Menu> */}
    </>
  )
}

export default SubtaskMemberSelector
