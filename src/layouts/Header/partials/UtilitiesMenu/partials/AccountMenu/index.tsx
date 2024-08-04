import { useEffect, useRef, useState } from 'react'
import './AccountMenu.scss'
import ThemeToggleButton from '../ThemeToggleButton'
import useClickTracker from '@hooks/useClickTracker'
import useAccount from '@hooks/useAccount'

function AccountMenu() {
  const account = useAccount()
  const [openMenu, setOpenMenu] = useState(false)
  const handleToggle = () => setOpenMenu(!openMenu)
  const container = useRef<HTMLDivElement>(null)
  const { outClick } = useClickTracker(container.current)
  useEffect(() => {
    if (outClick.isOutClick) {
      setOpenMenu(false)
    }
  }, [outClick])
  return (
    <>
      <div className='posr' ref={container}>
        <div className={`account-info ${openMenu ? 'open-account-menu' : ''}`} onClick={handleToggle}>
          <span className='account-info-avatar'>
            <img src={account?.avatar} alt='avatar image' />
          </span>
          <div className='account-info-item'>
            <p className='account-info-display-name'>{account?.displayName}</p>
            <i className='fa-solid fa-angle-down'></i>
          </div>
        </div>
        <div className={`account-menu ${openMenu ? 'open' : ''} menu-content-box-shadow`}>
          <div className='account-menu-item'>
            <p className='account-menu-item-header-text'>Theme</p>
            <ThemeToggleButton />
          </div>
          <div className='account-menu-item'>
            <i className='fa-solid fa-right-from-bracket'></i>&nbsp; Logout
          </div>
        </div>
      </div>
    </>
  )
}

export default AccountMenu
