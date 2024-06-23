import Flex from '@comps/StyledComponents/Flex'
import './Column.scss'
import Button from '@comps/Button'
import { forwardRef } from 'react'
import AddTask from './partials/AddTask'
import { ListResponseForBoard } from '@utils/types'

interface ColumnProps extends React.ComponentProps<'div'> {
  children?: React.ReactNode
  column?: ListResponseForBoard
}

function Column(props: ColumnProps, ref: React.ForwardedRef<HTMLDivElement>) {
  const { children, column, style, className, ...restProps } = props
  return (
    <>
      <div ref={ref} className={`column ${className ?? ''}`.trimEnd()} style={style} {...restProps}>
        <Flex $alignItem='center' $justifyContent='space-between' className='column-header'>
          <div className='column-header-name'>{column?.name}</div>
          <Button variant='text' theme='default' className='column-header-more-button'>
            <i className='fa-solid fa-ellipsis'></i>
          </Button>
        </Flex>
        <div className='column-body'>{children}</div>
        <div className='column-footer'>
          <AddTask />
        </div>
      </div>
    </>
  )
}

export default forwardRef(Column)
