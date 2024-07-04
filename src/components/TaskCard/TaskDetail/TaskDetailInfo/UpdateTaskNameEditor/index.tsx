import { useState } from 'react'
import './UpdateTaskNameEditor.scss'
import Button from '@comps/Button'
import Flex from '@comps/StyledComponents/Flex'
type UpdateTaskNameEditorProps = {
  taskName?: string
  onUpdateTaskName?: (taskName: string) => void
}
function UpdateTaskNameEditor({ taskName, onUpdateTaskName = () => {} }: UpdateTaskNameEditorProps) {
  const [name, setName] = useState<string>()
  // useEffect(() => {
  //   setName(taskName)
  // }, [taskName])
  const handleToggle = () => {
    setName(name !== undefined ? undefined : taskName)
  }
  const handleChangeName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value)
  }
  const handleUpdate = () => {
    if (name) {
      onUpdateTaskName(name)
      setName(undefined)
    }
  }
  return (
    <>
      {name === undefined ? (
        <h2 onClick={handleToggle} className='task-details-name'>
          {taskName}
        </h2>
      ) : (
        <>
          <Flex $alignItem='center' $gap='1rem'>
            <input
              className='input-change-task-name'
              id='change-task-name-input'
              value={name}
              onChange={handleChangeName}
            />
            <Button onClick={handleUpdate}>
              <i className='fa-solid fa-pen-to-square'></i> Update
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

export default UpdateTaskNameEditor
