import NotificationHeader from './partials/NotificationHeader'
import SearchInput from '@comps/SearchInput'
import MenuHeader from '@comps/MenuHeader'
import FixedMenu from '@comps/FixedMenu'
import ImageBox from '@comps/ImageBox'
import './UtilitiesMenu.scss'
import MenuFooter from '@comps/MenuFooter'
import MenuItem from '@comps/MenuItem'

function UtilitiesMenu() {
  return (
    <>
      <div className='utils-menu'>
        <SearchInput attributes={{ placeholder: 'Search', id: 'search-workspace' }} />

        <FixedMenu
          title={{
            content: <i className='fa-regular fa-bell'></i>,
            classes: 'utils-menu__hover utils-menu-notification tooltip',
            customHtmlAttributes: { 'tooltip-content': 'Notifications' }
          }}
          style={{ top: '3.43rem', right: '0.5%', paddingTop: '0' }}
          width='450px'
          side='right'
          layout={{
            header: {
              content: (
                <MenuHeader>
                  <NotificationHeader />
                </MenuHeader>
              )
            }
          }}
        >
          <ImageBox
            src='https://trello.com/assets/ee2660df9335718b1a80.svg'
            caption={{
              content: 'No unread notifications',
              style: { fontSize: '1.2rem' }
            }}
          />
        </FixedMenu>

        <FixedMenu
          title={{
            content: <i className='fa-regular fa-circle-question'></i>,
            classes: 'utils-menu__hover utils-menu-help tooltip',
            customHtmlAttributes: { 'tooltip-content': 'Information' }
          }}
          style={{ top: '3.43rem', right: '0.5%' }}
          height='half'
          width='350px'
          side='right'
          layout={{
            footer: {
              content: (
                <MenuFooter
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexWrap: 'wrap',
                    width: '100%',
                    gap: '1rem'
                  }}
                >
                  <p>Item 1</p>
                  <p>Item 2</p>
                  <p>Item 3</p>
                  <p>Item 4</p>
                  <p>Item 5</p>
                  <p>Item 6</p>
                </MenuFooter>
              )
            }
          }}
        >
          <ImageBox
            src='https://trello.com/assets/77d4b431a528da2dd7c6.png'
            caption={{
              content: (
                <>
                  <p>New to Trello? Check out the guide</p>
                  <div style={{ textAlign: 'center' }}>
                    <a href='#'>Get new tip...</a>
                  </div>
                </>
              ),
              style: { fontSize: '1rem' }
            }}
          />

          <MenuItem>Item 1</MenuItem>
          <MenuItem>Item 1</MenuItem>
          <MenuItem>Item 1</MenuItem>
          <MenuItem>Item 1</MenuItem>
          <MenuItem>Item 1</MenuItem>
          <MenuItem>Item 1</MenuItem>
        </FixedMenu>

        <div className='utils-menu-user tooltip' tooltip-content='Account'>
          <span>AH</span>
        </div>
      </div>
    </>
  )
}

export default UtilitiesMenu
