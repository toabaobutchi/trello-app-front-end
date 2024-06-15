import { RootState } from '@redux/store'
import { useSelector } from 'react-redux'

export default function useAccount() {
  const account = useSelector((state: RootState) => state.login)
  return account;
}