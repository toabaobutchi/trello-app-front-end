import './PriorityTag.scss'

interface PriorityTagProps extends React.ComponentPropsWithRef<'span'> {
  priority?: string | null // 'high', 'medium', 'low' or null (default)
}

function PriorityTag({ priority, onClick = () => {}, ...props }: PriorityTagProps) {
  return (
    <>
      <span
        className={`priority-tag priority-tag__${priority ? priority?.toLowerCase() : 'default'}`}
        onClick={onClick}
        {...props}
      >
        {priority ? priority + ' Priority' : 'Priority not set'}
      </span>
    </>
  )
}

export default PriorityTag
