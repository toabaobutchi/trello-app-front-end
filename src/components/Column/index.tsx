import Flex from '@comps/StyledComponents/Flex'
import './Column.scss'
import { forwardRef, useEffect, useState } from 'react'
import AddTask from './partials/AddTask'
import { ListResponseForBoard } from '@utils/types/list.type'
import AddTaskAbove from './partials/AddTaskAbove'
import ColumnOptionMenu from './partials/ColumnOptionMenu'
import useProjectOutletContext from '@hooks/useProjectOutletContext'
import { useProjectSelector } from '@hooks/useProjectSelector'
import { isAdminOrOwner } from '@utils/functions'
import { AssignmentResponse } from '@utils/types/assignment.type'

interface ColumnProps extends React.ComponentProps<'div'> {
  children?: React.ReactNode
  column?: ListResponseForBoard
}

const Column = forwardRef((props: ColumnProps, ref: React.ForwardedRef<HTMLDivElement>) => {
  const { children, column, style, className, ...restProps } = props
  const { members, board } = useProjectSelector()
  const [dragSub, setDragSub] = useState<AssignmentResponse>()
  const { remoteDragging } = useProjectOutletContext()

  useEffect(() => {
    setDragSub(members.find(m => m.id === remoteDragging?.subId))
  }, [remoteDragging, members])
  const overFlowWIP =
    column?.wipLimit !== undefined && column?.wipLimit > 0 && (column.tasks?.length ?? 0) >= column?.wipLimit
  const hasPermission = isAdminOrOwner(board.context)
  return (
    <>
      <div
        ref={ref}
        className={`column ${
          remoteDragging?.isDragging &&
          remoteDragging.dragObject === 'Column' &&
          remoteDragging.dragObjectId === column?.id
            ? 'remote-dragging-object'
            : ''
        } ${className ?? ''}`.trimEnd()}
        style={style}
        {...restProps}
        drag-subject={`${dragSub?.email} is dragging`}
      >
        <Flex $alignItem='center' $justifyContent='space-between' className='column-header'>
          <div className='column-header-name'>
            <p className='row gap-1'>
              {column?.name} <span className='column-header-task-count'>{column?.tasks?.length}</span>
            </p>
            {Boolean((column?.wipLimit ?? 0) > 0) && (
              <p className='text-danger wip-limit'>
                <i className='fa-solid fa-lock'></i> WIP Limit: {column?.wipLimit}
              </p>
            )}
          </div>
          {hasPermission && (
            <Flex $alignItem='center' $gap='0.25rem'>
              {!overFlowWIP && <AddTaskAbove column={column} />}
              <ColumnOptionMenu list={column} />
            </Flex>
          )}
        </Flex>
        <div onPointerDown={e => e.stopPropagation()} className='column-body'>
          {children}
        </div>
        {hasPermission && <div className='column-footer'>{!overFlowWIP && <AddTask column={props?.column} />}</div>}
      </div>
    </>
  )
})

export default Column
