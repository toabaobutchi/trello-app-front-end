import Menu from '@comps/Menu'
import MenuItem from '@comps/MenuItem'
import useMenu from '@hooks/useMenu'

const taskAssignments = [
  {
    displayName: 'John',
    id: 'abc',
    email: 'john@example.com',
    avatarUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSJIwASCJpICHRbFDOQXQ2S-pmikc8vs6K2GA&s'
  },
  {
    displayName: 'Hena',
    id: 'xyz',
    email: 'hena@example.com',
    avatarUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRYyKp-_bgWk7d5uBGUfl2Nxnm8FfmUXGcoHyKoRvfbj14dugmQw82HXTG_RLe1U4KWx0s&usqp=CAU'
  },
  {
    displayName: 'Cam',
    id: 'def',
    email: 'cam@example.com',
    avatarUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ8zx3vcYiH2J0MUFlZ1EcORxwgserN_RmQnw&s'
  },
  {
    displayName: 'Mary',
    id: 'ghj',
    email: 'mary@example.com',
    avatarUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRCYnLAL0b-nqnyHK2mxqGCDZo8PVH1SANOsg&s'
  }
]

function SubtaskMemberSelector() {
  const menu = useMenu<HTMLDivElement>()
  // Sử dụng modal
  return (
    <>
      <div className='subtasks-item-icon' ref={menu.anchorRef} onClick={menu.toggleMenu}>
        <i className='fa-regular fa-user'></i>
      </div>
      <Menu open={menu.open} anchorElement={menu.anchorRef.current} onClose={menu.closeMenu}>
        {taskAssignments.map(ta => {
          return (
            <MenuItem size='small' style={{fontSize: '0.9rem'}} key={ta.id} className='row gap-1'>
              <img className='avatar-image-selector' src={ta.avatarUrl} alt={ta.displayName} />
              <span>{ta.displayName}</span>
            </MenuItem>
          )
        })}
      </Menu>
    </>
  )
}

export default SubtaskMemberSelector
