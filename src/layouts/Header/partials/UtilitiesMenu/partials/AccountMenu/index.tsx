import { useSelector } from 'react-redux'
import FixedMenu from '@comps/FixedMenu'
import MenuGroup from '@comps/MenuGroup'
import MenuItem from '@comps/MenuItem'
import './AccountMenu.scss'
import config from '@confs/app.config'
import { RootState } from '@redux/store'

function AccountMenu() {
  const account = useSelector((state: RootState) => state.login)
  return (
    <>
      <FixedMenu
        side='right'
        title={{
          content: <img style={{ maxWidth: '100%', objectFit: 'cover', height: 'auto', borderRadius: '50%'  }} src={account.accountInfo?.avatar} alt="avatar image" />,
          className: 'utils-menu-user',
          style: { padding: 0  }
        }}
        style={{ top: config.header.height, right: '0.3%' }}
        width='330px'
      >
        <MenuGroup title={{ content: 'Account', style: { textTransform: 'uppercase' } }} divisor expandGroup={null}>
          <MenuItem>
            <div className='account-info'>
              <span className='account-info-avatar'><img src={account.accountInfo?.avatar} alt="avatar image" /></span>
              <div className='account-info-item'>
                <p className='account-info-display-name'>{account.accountInfo?.displayName}</p>
                <p className='account-info-email'>{account.accountInfo?.email}</p>
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
