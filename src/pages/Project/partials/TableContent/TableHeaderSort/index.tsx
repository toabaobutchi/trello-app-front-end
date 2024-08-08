import { useEffect, useRef, useState } from 'react'
import './TableHeaderSort.scss'
import useClickTracker from '@hooks/useClickTracker'

type TableHeaderSortProps = {
  header: React.ReactNode
  children: React.ReactNode
} & React.ComponentProps<'div'>

function TableHeaderSort({ header, children, ...props }: TableHeaderSortProps) {
  const [click, setClick] = useState(false)
  const headerRef = useRef<HTMLDivElement>(null)
  const { outClick } = useClickTracker(headerRef?.current)
  const handleToggle = () => {
    setClick(!click)
  }
  useEffect(() => {
    if (outClick.isOutClick && click) {
      handleToggle()
    }
  }, [outClick])
  return (
    <>
      <div {...props} ref={headerRef} className={`table-header-sort${props?.className ? ' ' + props.className : ''}`}>
        <p className='table-header-sort-title' onClick={handleToggle}>{header}</p>
        <div className={`table-header-sort-menu menu-content-box-shadow${click ? ' expanded' : ''}`}>{children}</div>
      </div>
    </>
  )
}

export default TableHeaderSort
