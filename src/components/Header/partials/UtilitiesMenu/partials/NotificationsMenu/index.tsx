import FixedMenu from '@comps/FixedMenu'
import MenuHeader from '@comps/MenuHeader'
import NotificationHeader from '../NotificationHeader'
import ImageBox from '@comps/ImageBox'
import config from '@confs/app.config'
import Tooltip from '@comps/Tooltip'
import { useHub } from '@hooks/useHub'
import { useSelector } from 'react-redux'
import { RootState } from '@redux/store'
import { useEffect } from 'react'

function NotificationMenu() {
  const account = useSelector((state: RootState) => state.login.accountInfo)
  const connection = useHub('/notificationHub', 'SubscribeNotification', account.id)
  useEffect(() => {
    if (connection) {
      connection.on('ReceiveProjectNotification', notification => {
        console.log('Received notification', notification)
      })
    }
  }, [connection])
  return (
    <>
      <FixedMenu
        title={{
          content: (
            <Tooltip content='Notifications' style={{ lineHeight: 'normal' }}>
              <i className='fa-regular fa-bell'></i>
            </Tooltip>
          ),
          className: 'utils-menu__hover utils-menu-notification'
        }}
        style={{ top: config.header.height, right: '0.5%', paddingTop: '0', minWidth: 'min(450px, 100%)' }}
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
