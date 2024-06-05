// import DropdownMenu from '@comps/DropdownMenu'
import MenuItem from '@comps/MenuItem'
import './NotificationHeader.scss'
import SwitchButton from '@comps/SwitchButton'
import DropdownMenu from '@comps/DropdownMenu'

function NotificationHeader() {
  return (
    <>
      <p className='notification-header-title'>Notifications</p>
      <div className='notification-header-options'>
        <div className='notification-header-options__unread'>
          <span> Only show unread </span>
          <SwitchButton
            inputAttributes={{
              type: 'checkbox',
              id: 'unread-notifications-checkbox',
              checked: true
            }}
            size='tiny'
          />
        </div>
        <DropdownMenu
          title={{
            content: <i className='fa-solid fa-ellipsis-vertical'></i>,
            className: 'notification-header-options-setting'
          }}
          dir='rtl'
          useArrow={false}
          useCloseIcon
          layout={{
            header: { content: 'Notifications setting' },
            footer: { content: 'Notifications setting footer' },
            useScrollbar: true
          }}
          style={{ maxHeight: '400px', width: '300px' }}
        >
          <MenuItem>Menu 1</MenuItem>
          <MenuItem>Menu 2</MenuItem>
          <MenuItem>Menu 3</MenuItem>
        </DropdownMenu>
      </div>
    </>
  )
}

export default NotificationHeader
