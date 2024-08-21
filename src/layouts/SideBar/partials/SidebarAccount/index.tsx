import useAccount from '@hooks/useAccount'

function SidebarAccount() {
  const account = useAccount()
  return (
    <div className='sidebar-account'>
      <img className='sidebar-account-avatar' src={account?.avatar} alt='avatar' />
      <div className='sidebar-account-info sidebar-text'>
        <p className='sidebar-account-name'>{account?.displayName}</p>
        <p className='sidebar-account-email'>{account?.email}</p>
      </div>
    </div>
  )
}

export default SidebarAccount
