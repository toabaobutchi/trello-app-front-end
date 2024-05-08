import FixedMenu from '@comps/FixedMenu'
import MenuGroup from '@comps/MenuGroup'
import MenuItem from '@comps/MenuItem'
import './AccountMenu.scss'

function AccountMenu() {
  return (
    <>
      <FixedMenu
        side='right'
        title={{
          content: 'AH',
          classes: 'utils-menu-user tooltip',
          customHtmlAttributes: { 'tooltip-content': 'Account' },
          style: { padding: 0 }
        }}
        style={{ top: '3.43rem', right: '0.3%' }}
        width='330px'
      >
        <MenuGroup title={{ content: 'Account', style: { textTransform: 'uppercase' } }} divisor expandGroup={null}>
          <MenuItem>
            <div className='account-info'>
              <span className='account-info-avatar'>AH</span>
              <div className='account-info-item'>
                <p className='account-info-display-name'>Ngô Hoài An</p>
                <p className='account-info-email'>ngohoaian01031@gmail.com</p>
              </div>
            </div>
          </MenuItem>
          <MenuItem>Switch accounts</MenuItem>
          <MenuItem>Manage account</MenuItem>
        </MenuGroup>
        <MenuGroup title={{ content: 'Trello', style: { textTransform: 'uppercase' } }} divisor expandGroup={null}>
          <MenuItem>Profile and visibility</MenuItem>
          <MenuItem>Activity</MenuItem>
          <MenuItem>Card</MenuItem>
          <MenuItem>Setting</MenuItem>
          <MenuItem>Theme</MenuItem>
        </MenuGroup>
        <MenuGroup divisor expandGroup={null}>
          <MenuItem>Help</MenuItem>
          <MenuItem>Shortcut</MenuItem>
        </MenuGroup>
        <MenuGroup expandGroup={null}>
          <MenuItem>Log out</MenuItem>
        </MenuGroup>
      </FixedMenu>
    </>
  )
}

export default AccountMenu
