import { useCallback, useEffect, useRef, useState } from 'react'
import './SelectList.scss'
import useClickTracker from '@hooks/useClickTracker'
import { isOutClick } from '@utils/functions'
import CustomizablePropType from '@utils/CustomizablePropType'

interface SelectListItem {
  value: string
  display?: React.ReactNode
}

interface SelectListProps extends React.ComponentProps<'div'> {
  items?: SelectListItem[]
  selectedValue?: string
  label?: CustomizablePropType
  onChoose?: (selectedItem: SelectListItem) => void
}

function SelectList({ items, selectedValue, onChoose = () => {}, label, ...props }: SelectListProps) {
  const [expand, setExpand] = useState(false)
  const selectListRef = useRef<HTMLDivElement>(null)
  const [selectedItem, setSelectedItem] = useState<SelectListItem | undefined>(() => {
    return items?.find(item => item.value === selectedValue) ?? items?.[0]
  })
  const handleSelect = (select: SelectListItem) => {
    setSelectedItem(select)
    onChoose(select)
    setExpand(!expand)
  }
  const handleToggleSelect = useCallback(() => {
    setExpand(!expand)
  }, [expand])
  const { outClick, reset } = useClickTracker(selectListRef.current as HTMLElement)
  useEffect(() => {
    if (outClick.isOutClick && expand) {
      handleToggleSelect()
      reset()
    }
  }, [expand, handleToggleSelect, outClick, reset])
  return (
    <>
      <p className={`select-list-label ${label?.className ?? ''}`.trimEnd()} style={label?.style}>
        {label?.content}
      </p>
      <div ref={selectListRef} className={`select-list ${props?.className ?? ''}`} style={props?.style}>
        <div className='selected-item' onClick={handleToggleSelect}>
          {selectedItem?.display}
        </div>
        {expand && (
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
