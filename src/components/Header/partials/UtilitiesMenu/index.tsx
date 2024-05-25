import SearchInput from '@comps/SearchInput'
import './UtilitiesMenu.scss'
import NotificationMenu from './partials/NotificationsMenu'
import InformationMenu from './partials/InformationMenu'
import AccountMenu from './partials/AccountMenu'
import Button from '@comps/Button'
import Modal from '@comps/Modal'
import { useState } from 'react'

function UtilitiesMenu() {
  const [searchModal, setSearchModal] = useState(false)
  const handleToggleSearchModal = () => setSearchModal(!searchModal)

  return (
    <>
      <div className='utils-menu'>
        <SearchInput attributes={{ placeholder: 'Search', id: 'search-workspace' }} />
        <Button
          onClick={handleToggleSearchModal}
          className='utils-menu__hover search-button-mobile'
          variant='text'
          theme='default'
          size='small'
        >
          <i className='fa-solid fa-magnifying-glass'></i>
        </Button>
        <Modal
          open={searchModal}
          onClose={handleToggleSearchModal}
          style={{ width: '80%' }}
          layout={{
            header: {
              title: 'Search',
              closeIcon: true
            }
          }}
        >
          <SearchInput
            style={{ width: '100%' }}
            attributes={{ placeholder: 'Search', id: 'mobile-search-workspace' }}
          />
        </Modal>
        <NotificationMenu />
        <InformationMenu />
        <AccountMenu />
      </div>
    </>
  )
}

export default UtilitiesMenu
