import FixedMenu from '@comps/FixedMenu'
import MenuHeader from '@comps/MenuHeader'
import NotificationHeader from '../NotificationHeader'
import ImageBox from '@comps/ImageBox'
import config from '@confs/app.config'

function NotificationMenu() {
  return (
    <>
      <FixedMenu
        title={{
          content: <i className='fa-regular fa-bell'></i>,
          className: 'utils-menu__hover utils-menu-notification tooltip',
          customHtmlAttributes: { 'tooltip-content': 'Notifications' }
        }}
        style={{ top: config.header.height, right: '0.5%', paddingTop: '0', minWidth: 'min(450px, 100%)'}}
        width='15%'
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
