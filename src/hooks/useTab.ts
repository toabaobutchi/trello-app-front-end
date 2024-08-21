import { useState } from 'react'

function useTab(initValue: string, handler?: (value: string) => void) {
  const [activeTab, setActiveTab] = useState(initValue)
  return {
    activeTab,
    handleTabClick: (clickedTabValue: string) => {
      setActiveTab(_prev => clickedTabValue)
      handler?.(clickedTabValue)
    }
  }
}

export default useTab
