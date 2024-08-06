import Tab, { TabNav } from '@comps/Tab'
import './ReferenceTasks.scss'
import { useState } from 'react'
import Button from '@comps/Button'
import RelatedTasks from './RelatedTasks'
import { useModal } from '@hooks/useModal'
import Modal from '@comps/Modal'
import ReferenceTaskSelector from './ReferenceTaskSelector'

const tabs: TabNav[] = [
  {
    value: 'dependencies',
    display: (
      <>
        <i className='fa-regular fa-circle-pause'></i> Dependencies
      </>
    )
  },
  {
    value: 'denpendedTasks',
    display: (
      <>
        <i className='fa-solid fa-puzzle-piece'></i> Denpend on this
      </>
    )
  }
]

const initTab = 'dependencies'

function ReferenceTasks() {
  const [activeTab, setActiveTab] = useState(initTab)
  const [taskSelectorModal, handleToggleTaskSelectorModal] = useModal()
  //FIXME Loc ra cac task da phu thuoc thi ko chon nua
  const handleTabClick = (value: string) => {
    setActiveTab(value)
    // load data from `value`
  }
  return (
    <>
      <div className='reference-tasks-container'>
        <div className='reference-tasks-search'>
          <div className='reference-tasks-search-box'>
            <input type='text' id='reference-tasks-search-input' placeholder=' ' name='referenceTasksSearchInput' />
            <label htmlFor='reference-tasks-search-input'>
              <i className='fa-solid fa-magnifying-glass'></i> Search tasks
            </label>
          </div>
        </div>
        <Tab tabs={tabs} onTabClick={handleTabClick} activeTab={activeTab}>
          <Tab.Content show>
            <RelatedTasks />
          </Tab.Content>
        </Tab>
        <div className='reference-tasks-actions'>
          <Button onClick={handleToggleTaskSelectorModal}>
            <i className='fa-solid fa-plus'></i> {activeTab === 'dependencies' ? 'Add new dependency' : 'Add new task'}
          </Button>
          <Modal
            layout={{
              header: {
                title: 'Select tasks',
                closeIcon: true
              }
            }}
            open={taskSelectorModal}
            onClose={handleToggleTaskSelectorModal}
          >
            <ReferenceTaskSelector />
          </Modal>
        </div>
      </div>
    </>
  )
}

export default ReferenceTasks
