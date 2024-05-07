import SearchInput from '@comps/SearchInput'
import './UtilitiesMenu.scss'
import NotificationMenu from './partials/NotificationsMenu'
import InformationMenu from './partials/InformationMenu'
import AccountMenu from './partials/AccountMenu'

function UtilitiesMenu() {
  return (
    <>
      <div className='utils-menu'>
        <SearchInput attributes={{ placeholder: 'Search', id: 'search-workspace' }} />
        <NotificationMenu />
        <InformationMenu />
        <AccountMenu />
      </div>
    </>
  )
}

export default UtilitiesMenu
