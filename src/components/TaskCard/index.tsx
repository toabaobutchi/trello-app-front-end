import Flex from '@comps/StyledComponents/Flex'
import PriorityTag from './PriorityTag'
import './TaskCard.scss'
import Button from '@comps/Button'
import DropdownMenu from '@comps/DropdownMenu'
import MenuItem from '@comps/MenuItem'
import { TaskForBoard } from '@utils/types'

function TaskCard({ task }: { task: TaskForBoard }) {
  return (
    <>
      <div className='task-card'>
        <Flex $alignItem='center' $justifyContent='space-between' className='task-card-header'>
          <PriorityTag priority={task.priority} />
          <DropdownMenu
            useArrow={false}
            dir='rtl'
            showOn='click'
            style={{ width: '150px' }}
            title={{
              content: (
                <Button variant='text' theme='default'>
                  <i className='fa-solid fa-ellipsis-vertical'></i>
                </Button>
              ),
              style: {
                padding: 0,
                borderRadius: 0
              }
            }}
          >
            <MenuItem>Option 1</MenuItem>
            <MenuItem>Option 1</MenuItem>
            <MenuItem>Option 1</MenuItem>
          </DropdownMenu>
        </Flex>
        <div className='task-card-body'>
          <div className='task-card-body-name'>{task.name}</div>
          <div className='task-card-body-description'>{task.description}</div>
          <div className="task-card-body-subtasks">
            Subtask: {task.subTaskStatus.finished}/{task.subTaskStatus.finished + task.subTaskStatus.unfinished}
          </div>
        </div>
        <Flex $alignItem='center' $justifyContent='space-between' className='task-card-footer'>
          <div className='task-card-footer-members'>{task.assigneeCount} member(s)</div>
          <div className='task-card-footer-due-date'>
            {task?.dueDate ? new Date(task.dueDate * 1000).toLocaleDateString() : ''}
          </div>
        </Flex>
      </div>
    </>
  )
}

export default TaskCard
