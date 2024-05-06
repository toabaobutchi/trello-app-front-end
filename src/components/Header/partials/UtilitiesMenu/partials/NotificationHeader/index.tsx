// import DropdownMenu from '@comps/DropdownMenu'
import MenuItem from '@comps/MenuItem'
import './NotificationHeader.scss'
import SwitchButton from '@comps/SwitchButton'
import DropdownMenu from '@comps/DropdownMenu/v2/DropdownMenu'

function NotificationHeader() {
  return (
    <>
      <p className='notification-header-title'>Notifications</p>
      <div className='notification-header-options'>
        <div className='notification-header-options__unread'>
          <span> Only show unread </span>
          {/* <input defaultChecked type='checkbox' /> */}
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
            classes: 'notification-header-options-setting'
          }}
          dir='rtl'
          useArrow={false}
          useCloseIcon
          layout={{
            header: { content: 'Notifications setting' },
            footer: { content: 'Notifications setting footer' },
            useScrollbar: true
          }}
          style={{ height: '400px', width: '300px' }}
        >
          <MenuItem>Menu 1</MenuItem>
          <MenuItem>Menu 2</MenuItem>
          <MenuItem>Menu 3</MenuItem>
          <MenuItem>Menu 4</MenuItem>
          <MenuItem>Menu 5</MenuItem>
          <MenuItem>Menu 6</MenuItem>
          <MenuItem>Menu 7</MenuItem>
          <MenuItem>Menu 8</MenuItem>
          <MenuItem>Menu 9</MenuItem>
        </DropdownMenu>
      </div>
    </>
  )
}

export default NotificationHeader
