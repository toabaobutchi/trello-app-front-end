import Tab, { TabNav } from '@comps/Tab'
import './ReferenceTasks.scss'
import { useContext, useEffect, useState } from 'react'
import Button from '@comps/Button'
import RelatedTasks from './RelatedTasks'
import { useModal } from '@hooks/useModal'
import Modal from '@comps/Modal'
import ReferenceTaskSelector from './ReferenceTaskSelector'
import { addChildrenTasks, addDependencies, deleteRelatedTask, getRelatedTasks } from '@services/task.services'
import { TaskDetailContext } from '@pages/TaskDetailBoard/context'
import { useDispatch } from 'react-redux'
import { projectSlice } from '@redux/ProjectSlice'
import { hubs, ProjectHub } from '@utils/Hubs'
import { DeletedRelationshipResponse, DispatchRelatedTaskResponse, ReferenceTasks as RefTasks, RelatedTaskResponse } from '@utils/types/task.type'

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
        <i className='fa-solid fa-puzzle-piece'></i> Depend on this
      </>
    )
  }
]

const initTab = 'dependencies'
// type RefTasks = ReferenceTasks
const initRefTask: RefTasks = {
  childTasks: [],
  dependencies: []
}

function ReferenceTasks() {
  const [activeTab, setActiveTab] = useState(initTab)
  const [taskSelectorModal, handleToggleTaskSelectorModal] = useModal()
  const context = useContext(TaskDetailContext)
  const [refTasks, setRefTasks] = useState<RefTasks>(initRefTask)
  const dispatch = useDispatch()
  const [projectHub] = useState(new ProjectHub())

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

  useEffect(() => {
    if (projectHub.isConnected && context?.task?.id) {
      projectHub.connection?.on(
        hubs.project.receive.addTaskDependencies,
        (_assignmentId: string, taskId: string, relatedTasks: RelatedTaskResponse[]) => {
          if (taskId === context?.task?.id) {
            setRefTasks(prev => ({ ...prev, dependencies: [...(prev?.dependencies ?? []), ...relatedTasks] }))
          }
        }
      )

      projectHub.connection?.on(
        hubs.project.receive.addChildrenTasks,
        (_assignmentId: string, taskId: string, relatedTasks: RelatedTaskResponse[]) => {
          if (taskId === context?.task?.id) {
            setRefTasks(prev => ({ ...prev, childTasks: [...(prev?.childTasks ?? []), ...relatedTasks] }))
          }
        }
      )

      projectHub.connection?.on(
        hubs.project.receive.removeTaskDependency,
        (_assignmentId: string, taskId: string, data: DeletedRelationshipResponse) => {
          if (taskId === context?.task?.id) {
            setRefTasks(prev => ({
              ...prev,
              dependencies: prev.dependencies.filter(t => t.id !== data.relationshipId)
            }))
          }
        }
      )

      projectHub.connection?.on(
        hubs.project.receive.removeChildrenTask,
        (_assignmentId: string, taskId: string, data: DeletedRelationshipResponse) => {
          if (taskId === context?.task?.id) {
            setRefTasks(prev => ({ ...prev, childTasks: prev.childTasks.filter(t => t.id !== data.relationshipId) }))
          }
        }
      )
    }
  }, [projectHub.isConnected, context?.task?.id])

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

          // dispatch
          dispatch(
            projectSlice.actions.addFromDependencies({
              taskId: context?.task?.id,
              relatedTasks: data
            } as DispatchRelatedTaskResponse)
          )

          // send to hub
          if (projectHub.isConnected) {
            projectHub.connection?.invoke(hubs.project.send.addTaskDependencies, context?.task?.id, data)
          }
        }
      } else {
        const res = await addChildrenTasks(context?.task?.id, taskIds)
        if (res?.isSuccess) {
          const data = res.data
          // add dependencies
          setRefTasks(prev => ({ ...prev, childTasks: [...(prev?.childTasks ?? []), ...data] }))

          // dispatch
          dispatch(
            projectSlice.actions.addFromChildren({
              taskId: context?.task?.id,
              relatedTasks: data
            } as DispatchRelatedTaskResponse)
          )

          // send to hub
          if (projectHub.isConnected) {
            projectHub.connection?.invoke(hubs.project.send.addChildrenTasks, context?.task?.id, data)
          }
        }
      }
      handleToggleTaskSelectorModal()
    }
  }

  const handleDelete = async (refTaskId: string) => {
    if (context?.task?.id) {
      const res = await deleteRelatedTask(
        context?.task?.id,
        refTaskId,
        activeTab === tabs[0].value ? 'dependencies' : 'children'
      )
      if (res?.isSuccess) {
        const data = res.data
        if (data.relationshipType === 'Dependencies') {
          setRefTasks(prev => ({ ...prev, dependencies: prev.dependencies.filter(t => t.id !== data.relationshipId) }))

          // dispatch
          dispatch(projectSlice.actions.removeFromDependencies(data))

          // send to hub
          if (projectHub.isConnected) {
            projectHub.connection?.invoke(hubs.project.send.removeTaskDependency, data)
          }
        } else {
          setRefTasks(prev => ({ ...prev, childTasks: prev.childTasks.filter(t => t.id !== data.relationshipId) }))

          // dispatch
          dispatch(projectSlice.actions.removeFromChildren(data))

          // send to hub
          if (projectHub.isConnected) {
            projectHub.connection?.invoke(hubs.project.send.removeChildrenTask, data)
          }
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
          <Tab.Content show>
            {refTasks && (
              <RelatedTasks isChildren={activeTab === tabs[1].value} onDelete={handleDelete} tasks={activeDataSource} />
            )}
          </Tab.Content>
        </Tab>
        <div className='reference-tasks-actions mt-1'>
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
            style={{ maxHeight: '600px', overflowY: 'auto' }}
          >
            <ReferenceTaskSelector usedTasks={refTasks} onConfirmSelect={handleAddRelatedTasks} />
          </Modal>
        </div>
      </div>
    </>
  )
}

export default ReferenceTasks
