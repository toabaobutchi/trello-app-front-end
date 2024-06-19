import Flex from '@comps/StyledComponents/Flex'
import './Column.scss'
import Button from '@comps/Button'

interface ColumnProps extends React.ComponentProps<'div'> {
  children?: React.ReactNode
  columnName?: React.ReactNode
}

function Column(props: ColumnProps) {
  return (
    <>
      <div className={`column ${props?.className ?? ''}`.trimEnd()} style={props?.style}>
        <Flex $alignItem='center' $justifyContent='space-between' className='column-header'>
          <div className='column-header-name'>{props?.columnName}</div>
          <Button variant='text' theme='default' className='column-header-more-button'>
            <i className='fa-solid fa-ellipsis'></i>
          </Button>
        </Flex>
        <div className='column-body'>
          {props?.children}
        </div>
        <div className='column-footer'>
          <Button variant='text'><i className="fa-solid fa-plus"></i> Add a task ...</Button>
        </div>
      </div>
    </>
  )
}

export default Column
