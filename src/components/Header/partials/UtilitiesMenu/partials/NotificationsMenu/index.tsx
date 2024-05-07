import FixedMenu from '@comps/FixedMenu'
import MenuHeader from '@comps/MenuHeader'
import NotificationHeader from '../NotificationHeader'
import ImageBox from '@comps/ImageBox'

function NotificationMenu() {
  return (
    <>
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
    </>
  )
}

export default NotificationMenu
