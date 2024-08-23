import { ProjectHub } from '@utils/Hubs'
import { useState } from 'react'

export default function useProjectHub() {
  const [projectHub] = useState(new ProjectHub())
  return projectHub
}
