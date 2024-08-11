import { RemoteDraggingType } from '@utils/types'
import { useOutletContext } from 'react-router-dom'

export type ProjectContextType = {
  remoteDragging?: RemoteDraggingType
}

export default function useProjectOutletContext() {
  return useOutletContext<ProjectContextType>()
}
