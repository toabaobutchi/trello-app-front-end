import Flex from '@comps/StyledComponents/Flex'
import './Column.scss'
import Button from '@comps/Button'
import { forwardRef, useEffect, useState } from 'react'
import AddTask from './partials/AddTask'
import { AssignmentResponse, ListResponseForBoard } from '@utils/types'
import { RemoteDraggingType } from '@pages/Project/partials/BoardContent'
import { useSelector } from 'react-redux'
import { RootState } from '@redux/store'

interface ColumnProps extends React.ComponentProps<'div'> {
  children?: React.ReactNode
  column?: ListResponseForBoard
  remoteDragging?: RemoteDraggingType
}

function Column(props: ColumnProps, ref: React.ForwardedRef<HTMLDivElement>) {
  const { children, column, style, className, remoteDragging, ...restProps } = props
  const members = useSelector((state: RootState) => state.project.activeProject.members)
  const [dragSub, setDragSub] = useState<AssignmentResponse>()
  useEffect(() => {
    setDragSub(members.find(m => m.id === remoteDragging?.subId))
  }, [remoteDragging, members])
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
          <div className='column-header-name'>{column?.name}</div>
          <Button variant='text' theme='default' className='column-header-more-button'>
            <i className='fa-solid fa-ellipsis'></i>
          </Button>
        </Flex>
        <div onPointerDown={e => e.stopPropagation()} className='column-body'>
          {children}
        </div>
        <div className='column-footer'>
          <AddTask column={props?.column} />
        </div>
      </div>
    </>
  )
}

export default forwardRef(Column)
