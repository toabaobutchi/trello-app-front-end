import Tab, { TabNav } from '@comps/Tab'
import './ReferenceTasks.scss'
import { useContext, useEffect, useState } from 'react'
import Button from '@comps/Button'
import RelatedTasks from './RelatedTasks'
import { useModal } from '@hooks/useModal'
import Modal from '@comps/Modal'
import ReferenceTaskSelector from './ReferenceTaskSelector'
import { addChildrenTasks, addDependencies, getRelatedTasks } from '@services/task.services'
import { TaskDetailContext } from '@pages/TaskDetailBoard/context'
import { ReferenceTasks as RefTasks } from '@utils/types'

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
const initRefTask: RefTasks = {
  childTasks: [],
  dependencies: []
}

function ReferenceTasks() {
  const [activeTab, setActiveTab] = useState(initTab)
  const [taskSelectorModal, handleToggleTaskSelectorModal] = useModal()
  const context = useContext(TaskDetailContext)
  const [refTasks, setRefTasks] = useState<RefTasks>(initRefTask)
  //FIXME Loc ra cac task da phu thuoc thi ko chon nua
  useEffect(() => {
    if (context?.task) {
      const task = context.task
      getRelatedTasks(task.id).then(res => {
        if (res?.isSuccess) {
          setRefTasks(res.data)
        }
      })
    }
  }, [context?.task])

  const handleTabClick = (value: string) => {
    setActiveTab(value)
  }
  const handleAddRelatedTasks = async (taskIds: string[]) => {
    if (taskIds?.length > 0 && context?.task?.id) {
      if (activeTab === tabs[0].value) {
        const res = await addDependencies(context?.task?.id, taskIds)
        if (res?.isSuccess) {
          const data = res.data
          // add dependencies
          setRefTasks(prev => ({ ...prev, dependencies: [...(prev?.dependencies ?? []), ...data] }))
          handleToggleTaskSelectorModal()
        }
      } else {
        const res = await addChildrenTasks(context?.task?.id, taskIds)
        if (res?.isSuccess) {
          const data = res.data
          // add dependencies
          setRefTasks(prev => ({ ...prev, childTasks: [...(prev?.childTasks ?? []), ...data] }))
          handleToggleTaskSelectorModal()
        }
      }
    }
  }
  const activeDataSource = activeTab === tabs[0].value ? refTasks.dependencies : refTasks.childTasks
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
          <Tab.Content show>{refTasks && <RelatedTasks tasks={activeDataSource} />}</Tab.Content>
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
            <ReferenceTaskSelector usedTasks={refTasks} onConfirmSelect={handleAddRelatedTasks} />
          </Modal>
        </div>
      </div>
    </>
  )
}

export default ReferenceTasks
