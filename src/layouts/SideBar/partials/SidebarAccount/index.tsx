import Tooltip from '@comps/Tooltip-v2'
import useAccount from '@hooks/useAccount'

function SidebarAccount({ sidebarExpanded = true }: { sidebarExpanded?: boolean }) {
  const account = useAccount()
  return (
    <div
      className={`sidebar-account cpointer${
        sidebarExpanded ? ' border border-thin border-light border-hover-primary primary-radius' : ''
      }`}
    >
      <Tooltip content={!sidebarExpanded ? account?.email : ''} arrow position='right'>
        <img className='sidebar-account-avatar avatar-img avatar-img__small' src={account?.avatar} alt='avatar' />
      </Tooltip>
      <div className='sidebar-account-info sidebar-text'>
        <p className='sidebar-account-name'>{account?.displayName}</p>
        <p className='sidebar-account-email'>{account?.email}</p>
      </div>
    </div>
  )
}

export default SidebarAccount
