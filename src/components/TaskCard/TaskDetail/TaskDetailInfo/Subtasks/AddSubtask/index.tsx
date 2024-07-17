import Button from '@comps/Button'
import MultipleInput from '@comps/MultipleInput'
import Flex from '@comps/StyledComponents/Flex'
import { HubConnection } from '@microsoft/signalr'
import { RootState } from '@redux/store'
import { hubs } from '@utils/Hubs'
import { AssignmentResponse } from '@utils/types'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

type AddSubtaskProps = {
  onAddTask: (values: string[]) => void
  hubConnection?: HubConnection
  taskId?: string
}

function AddSubtask({ onAddTask, hubConnection, taskId }: AddSubtaskProps) {
  const [texts, setTexts] = useState<string[]>([])
  const [remoteActors, setRemoteActors] = useState<AssignmentResponse[]>([])
  const project = useSelector((state: RootState) => state.project.activeProject)
  const [openInput, setOpenInput] = useState(false)
  useEffect(() => {
    if (hubConnection) {
      // ReceiveAddingSubtasks
      hubConnection.on(hubs.project.receive.addingSubtasks, (assignmentId: string, taskid: string) => {
        if (taskId !== taskid) return
        const actor = project?.members?.find(m => m.id === assignmentId)
        if (actor) {
          setRemoteActors(prev => [...prev, actor])
        }
      })
      // ReceiveFinishAddSubtasks
      hubConnection.on(hubs.project.receive.finishAddSubtasks, (assignmentId: string, taskid: string) => {
        if (taskid !== taskId) return
        setRemoteActors(prev => {
          let newRemoteActors = [...prev]
          newRemoteActors = newRemoteActors.filter(a => a.id !== assignmentId)
          return newRemoteActors
        })
      })
    }
  }, [hubConnection])
  const handleToggle = () => {
    setOpenInput(!openInput)
    // ấn cancel và đã có nhập dữ liệu rồi
    if (hubConnection && !openInput && texts.length > 0) {
      // SendFinishAddSubtasks
      hubConnection.invoke(hubs.project.send.finishAddSubtasks, taskId)
    }
    setTexts([])
  }
  const handleDelele = (index: number) => {
    setTexts(texts.filter((_, i) => i !== index))
  }
  const handleAddTask = () => {
    if (texts.length) {
      if (hubConnection) {
        // SendFinishAddSubtasks
        hubConnection.invoke(hubs.project.send.finishAddSubtasks, taskId)
      }
      onAddTask(texts)
    }
    handleToggle()
  }
  const handleTrigger = (value: string) => {
    // gọi 1 lần, không cần gọi lần 2
    if (hubConnection && texts.length === 0) {
      // SendAddingSubtasks
      hubConnection.invoke(hubs.project.send.addingSubtasks, taskId)
    }
    setTexts([...texts, value])
  }
  return (
    <>
      {remoteActors.length > 0 && (
        <>
          <p className='text-primary'>Someone is adding subtasks</p>
          <ul className='remote-actors'>
            {remoteActors.map(actor => {
              return (
                <li key={actor.id} className='row gap-1'>
                  <img src={actor?.avatar} alt='avatar' />
                  <span>{actor?.email}</span>
                </li>
              )
            })}
          </ul>
        </>
      )}
      {!openInput ? (
        <Button onClick={handleToggle} variant='filled' className='mt-1'>
          Add new subtask
        </Button>
      ) : (
        <>
          <MultipleInput
            label='Subtask name'
            values={texts}
            valueBoxVariant='outlined'
            onTrigger={handleTrigger}
            onDelete={handleDelele}
            input={{ autoFocus: true, id: 'add-new-subtasks-input' }}
          />
          <Flex $alignItem='center' $gap='0.5rem' className='mt-1'>
            <Button onClick={handleAddTask}>
              <i className='fa-solid fa-plus'></i> Add
            </Button>
            <Button onClick={handleToggle} theme='danger'>
              <i className='fa-solid fa-xmark'></i> Cancel
            </Button>
          </Flex>
        </>
      )}
    </>
  )
}

export default AddSubtask
