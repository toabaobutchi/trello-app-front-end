import SearchInput from '@comps/SearchInput'
import './UtilitiesMenu.scss'
import NotificationMenu from './partials/NotificationsMenu'
import InformationMenu from './partials/InformationMenu'
import AccountMenu from './partials/AccountMenu'
import Button from '@comps/Button'

function UtilitiesMenu() {
  return (
    <>
      <div className='utils-menu'>
        <SearchInput attributes={{ placeholder: 'Search', id: 'search-workspace' }} />
        <Button className='utils-menu__hover search-button-mobile' variant='text' theme='default' size='small'>
          <i className='fa-solid fa-magnifying-glass'></i>
        </Button>
        <NotificationMenu />
        <InformationMenu />
        <AccountMenu />
      </div>
    </>
  )
}

export default UtilitiesMenu
