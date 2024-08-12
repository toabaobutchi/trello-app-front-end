import Button from '@comps/Button'
import './TableTaskItemMenu.scss'
import { useEffect, useRef, useState } from 'react'
import MenuItem from '@comps/MenuItem'
import useClickTracker from '@hooks/useClickTracker'

type TableTaskItemMenuProps = {
  onJoinTask?: () => void
  onDeleteTask?: () => void
  onAssign?: () => void
  isJoined?: boolean
}

function TableTaskItemMenu({
  isJoined = false,
  onJoinTask = () => {},
  onDeleteTask = () => {},
  onAssign = () => {}
}: TableTaskItemMenuProps) {
  const [click, setClick] = useState(false)

  const handleToggleClick = () => setClick(!click)
  const container = useRef<HTMLDivElement>(null)
  const { outClick } = useClickTracker(container?.current)

  useEffect(() => {
    if (outClick.isOutClick && click) {
      handleToggleClick()
    }
  }, [outClick])

  const handleJoinTask = () => {
    handleToggleClick()
    onJoinTask()
  }

  return (
    <>
      <div ref={container} className='table-task-item-actions-menu'>
        <Button onClick={handleToggleClick} variant='text' className='table-task-item-actions-menu-toggle-btn'>
          <i className='fa-solid fa-screwdriver-wrench'></i>
        </Button>
        <div className={`table-task-item-actions-menu-dropdown menu-content-box-shadow${click ? ' expanded' : ''}`}>
          {/* <MenuItem className='table-task-item-actions-menu-item'>
            <i className='fa-solid fa-wrench'></i>&nbsp; Details & Edit
          </MenuItem> */}
          {!isJoined && (
            <MenuItem className='table-task-item-actions-menu-item' onClick={handleJoinTask}>
              <i className='fa-solid fa-right-to-bracket'></i>&nbsp; Join this task
            </MenuItem>
          )}
          <MenuItem onClick={onAssign} className='table-task-item-actions-menu-item'>
            <i className='fa-solid fa-user-plus'></i>&nbsp; Assign
          </MenuItem>
          <MenuItem
            onClick={onDeleteTask}
            className='table-task-item-actions-menu-item border-top text-danger'
            size='small'
          >
            <i className='fa-solid fa-trash-alt'></i>&nbsp; Delete
          </MenuItem>
        </div>
      </div>
    </>
  )
}

export default TableTaskItemMenu
