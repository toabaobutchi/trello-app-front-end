import Button from '@comps/Button'
import Modal from '@comps/Modal'
import SearchInput from '@comps/SearchInput'
import { useState } from 'react'

function MobileSearch() {
  const [searchModal, setSearchModal] = useState(false)
  const handleToggleSearchModal = () => setSearchModal(!searchModal)
  return (
    <>
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
        <SearchInput style={{ width: '100%' }} attributes={{ placeholder: 'Search', id: 'mobile-search-workspace' }} />
      </Modal>
    </>
  )
}

export default MobileSearch
