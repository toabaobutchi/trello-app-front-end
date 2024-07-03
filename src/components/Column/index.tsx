import Flex from '@comps/StyledComponents/Flex'
import './Column.scss'
import Button from '@comps/Button'
import { forwardRef } from 'react'
import AddTask from './partials/AddTask'
import { ListResponseForBoard } from '@utils/types'
import { RemoteDraggingType } from '@pages/Project/partials/BoardContent'

interface ColumnProps extends React.ComponentProps<'div'> {
  children?: React.ReactNode
  column?: ListResponseForBoard
  remoteDragging?: RemoteDraggingType
}

function Column(props: ColumnProps, ref: React.ForwardedRef<HTMLDivElement>) {
  const { children, column, style, className, ...restProps } = props
  return (
    <>
      <div
        ref={ref}
        className={`column ${
          props?.remoteDragging?.isDragging &&
          props?.remoteDragging.dragObject === 'Column' &&
          props?.remoteDragging.dragObjectId === column?.id
            ? 'remote-dragging-object'
            : ''
        } ${className ?? ''}`.trimEnd()}
        style={style}
        {...restProps}
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
