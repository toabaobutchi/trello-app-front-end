import './PriorityTag.scss'

function PriorityTag({ priority }: { priority?: string | null }) {
  return (
    <>
      <span className={`priority-tag priority-tag__${priority?.toLowerCase() ?? 'default'}`}>
        {priority ? priority + ' Priority' : 'Priority not set'}
      </span>
    </>
  )
}

export default PriorityTag
