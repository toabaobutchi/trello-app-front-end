import { RootState } from '@redux/store'
import { useSelector } from 'react-redux'

export function useProjectSelector() {
  const project = useSelector((state: RootState) => state.project.activeProject)
  return project
}
