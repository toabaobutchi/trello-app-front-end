import { RootState } from '@redux/store'
import { useSelector } from 'react-redux'

export default function useWorkspace() {
  return useSelector((state: RootState) => state.workspaces)
}
