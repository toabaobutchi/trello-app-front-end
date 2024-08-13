import SearchInput from '@comps/SearchInput'
import './UtilitiesMenu.scss'
import NotificationMenu from './partials/NotificationsMenu'
import AccountMenu from './partials/AccountMenu'
import MobileSearch from './partials/MobileSearch'

function UtilitiesMenu() {
  return (
    <>
      <div className='utils-menu'>
        {/* <SearchInput attributes={{ placeholder: 'Search', id: 'search-workspace' }} /> */}
        {/* <MobileSearch /> */}
        <NotificationMenu />
        <AccountMenu />
      </div>
    </>
  )
}

export default UtilitiesMenu
