import { AccountType } from '@utils/types'

export default function useAccount() {
  const token = localStorage.getItem('account')
  const account = JSON.parse(atob(token ?? '')) as AccountType
  return account
}
