import { useState } from 'react'

function useTab(initValue: string) {
  const [activeTab, setActiveTab] = useState(initValue)
  return {
    activeTab,
    handleTabClick: (clickedTabValue: string) => setActiveTab(_prev => clickedTabValue)
  }
}

export default useTab
