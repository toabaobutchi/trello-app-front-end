import { useOutClickRef } from '@hooks/useOutClickRef'
import useToggle from '@hooks/useToggle'
import { CustomizablePropType } from '@utils/types'
import { Theme } from '@utils/types/theme.type'
import { useEffect, useId, useState } from 'react'
import './SelectList.scss'

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
  theme?: Theme
}

function SelectList({
  items,
  selectedValue,
  onChoose = () => {},
  label,
  size = 'medium',
  manualSelectedValue,
  theme = 'primary',
  ...props
}: SelectListProps) {
  const [expand, handleToggleSelect, setExpand] = useToggle()
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

  const selectListRef = useOutClickRef<HTMLDivElement>(e => {
    const targetNode = e.target as HTMLElement
    const hasParentSelectorAsSelectlistItem = targetNode.closest('.select-list-data-context-item') !== null
    if (!targetNode.classList?.contains('select-list-data-context-item') && !hasParentSelectorAsSelectlistItem) {
      expand && handleClose()
    }
  })

  return (
    <>
      <p className={`select-list-label ${label?.className ?? ''}`.trimEnd()} style={label?.style}>
        {label?.content}
      </p>
      <div
        id={selectListId}
        className={`select-list select-list__${theme} ${size}-list ${props?.className ?? ''}`.trimEnd()}
        style={props?.style}
      >
        <div ref={selectListRef} className={`selected-item`} onClick={handleToggleSelect}>
          {selectedItem?.display || selectedItem?.value} <i className='fa-solid fa-caret-down'></i>
        </div>
        {expand && items && (
          <div className='select-list-data-context'>
            {items?.map(item => {
              return (
                <div
                  key={item.value}
                  className={`select-list-data-context-item ${
                    item.value === selectedItem?.value ? 'selected-context-item' : ''
                  }`}
                  onClick={() => {
                    // e.stopPropagation()
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
