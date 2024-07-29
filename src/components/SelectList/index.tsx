import { useCallback, useEffect, useId, useRef, useState } from 'react'
import './SelectList.scss'
import useClickTracker from '@hooks/useClickTracker'
import { CustomizablePropType } from '@utils/types'

interface SelectListItem {
  value: string
  display?: React.ReactNode
}

interface SelectListProps extends React.ComponentProps<'div'> {
  items?: SelectListItem[]
  selectedValue?: string
  label?: CustomizablePropType
  onChoose?: (selectedItem: SelectListItem) => void
  size?: 'small' | 'medium' | 'large'
  manualSelectedValue?: string
}

function SelectList({
  items,
  selectedValue,
  onChoose = () => {},
  label,
  size = 'medium',
  manualSelectedValue,
  ...props
}: SelectListProps) {
  const [expand, setExpand] = useState(false)
  const selectListRef = useRef<HTMLDivElement>(null)
  const selectListId = useId()
  const [selectedItem, setSelectedItem] = useState<SelectListItem | undefined>(() => {
    const selected = items?.find(item => item.value === selectedValue) ?? items?.[0]
    return selected
  })

  useEffect(() => {
    if (manualSelectedValue && selectedItem && manualSelectedValue !== selectedItem.value) {
      setSelectedItem(items?.find(item => item.value === manualSelectedValue))
    }
  }, [manualSelectedValue])

  const handleSelect = (select: SelectListItem) => {
    setSelectedItem(select)
    onChoose(select)
    handleClose()
  }
  const handleClose = () => setExpand(_ => false)
  const handleToggleSelect = () => {
    setExpand(!expand)
  }
  const { outClick } = useClickTracker(selectListRef.current as HTMLElement)
  useEffect(() => {
    if (outClick.isOutClick && expand) {
      handleClose()
      // reset()
    }
  }, [outClick])
  return (
    <>
      <p className={`select-list-label ${label?.className ?? ''}`.trimEnd()} style={label?.style}>
        {label?.content}
      </p>
      <div
        id={selectListId}
        className={`select-list ${size}-list ${props?.className ?? ''}`.trimEnd()}
        style={props?.style}
      >
        <div ref={selectListRef} className='selected-item' onClick={handleToggleSelect}>
          <>{selectedItem?.display || selectedItem?.value}</> <i className='fa-solid fa-caret-down'></i>
        </div>
        {expand && items && (
          <div className='select-list-data-context'>
            {items?.map(item => {
              return (
                <div
                  key={item.value}
                  className='select-list-data-context-item'
                  onClick={(e: React.MouseEvent<HTMLDivElement>) => {
                    e.stopPropagation()
                    handleSelect(item)
                  }}
                >
                  {item.display}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </>
  )
}

export default SelectList
