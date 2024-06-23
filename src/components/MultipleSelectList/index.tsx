import { useCallback, useEffect, useRef, useState } from 'react'
import './MultipleSelectList.scss'
import { SelectListItem } from '@utils/types'
import MenuItem from '@comps/MenuItem'
import useClickTracker from '@hooks/useClickTracker'

type MultipleSelectListProps = {
  items: SelectListItem[]
  selectedItems?: SelectListItem[]
  onSelect?: (item: SelectListItem[]) => void
  label?: React.ReactNode
}

type SelectListState = {
  selectedItems: SelectListItem[]
  isSelecting: boolean
  restSelectList: SelectListItem[]
}

function MultipleSelectList({ items, selectedItems, label = '', onSelect = () => {} }: MultipleSelectListProps) {
  const [selectList, setSelectList] = useState<SelectListState>({
    selectedItems: selectedItems ?? [],
    isSelecting: false,
    restSelectList: items.filter(item => {
      const index = selectedItems?.findIndex((sItem: SelectListItem) => sItem.value === item.value)
      return index === -1
    })
  })
  const handleToggleSelect = useCallback(() => {
    setSelectList({
      ...selectList,
      isSelecting: !selectList.isSelecting
    })
  }, [selectList])

  const handleSelectItem = (item: SelectListItem) => {
    // kiem tra ton tai - neu chua thi them vao
    const index = selectList.selectedItems.findIndex(i => i.value === item.value)
    if (index === -1) {
      const currentSelectList = {
        selectedItems: [...selectList.selectedItems, item],
        restSelectList: selectList.restSelectList.filter(i => i.value !== item.value),
        isSelecting: false
      }
      setSelectList(currentSelectList)
      onSelect(currentSelectList.selectedItems)
    }
  }
  const handleDeleteItem = (item: SelectListItem) => {
    const currentSelectList = {
      selectedItems: selectList.selectedItems.filter(i => i.value !== item.value),
      restSelectList: [...selectList.restSelectList, item],
      isSelecting: false
    }
    setSelectList(currentSelectList)
    onSelect(currentSelectList.selectedItems)
  }
  const selectMenuRef = useRef<HTMLDivElement>(null)
  const { outClick, reset } = useClickTracker(selectMenuRef?.current as HTMLElement)
  useEffect(() => {
    if (outClick.isOutClick && selectList.isSelecting) {
      handleToggleSelect()
      reset()
    }
  }, [outClick, handleToggleSelect, reset, selectList.isSelecting])
  return (
    <>
      <p className='multiple-select-list-label'>{label}</p>
      <div className='multiple-select-list row gap-2'>
        {selectList.selectedItems?.map(item => {
          return (
            <div
              onDoubleClick={() => handleDeleteItem(item)}
              key={item.value}
              className='multiple-select-list__selected-list-item'
            >
              <p style={{ flex: 1 }}>{item.display}</p>
              <button
                onClick={() => handleDeleteItem(item)}
                className='multiple-select-list__selected-list-item-clearBtn'
              >
                <i className='fa-solid fa-xmark'></i>
              </button>
            </div>
          )
        })}
        <div className='multiple-select-list-options'>
          <button
            disabled={selectList.restSelectList.length <= 0}
            onClick={handleToggleSelect}
            className='multiple-select-list-options-toggleBtn'
          >
            <i className='fa-solid fa-caret-down'></i>
          </button>
          {selectList.isSelecting && selectList.restSelectList.length !== 0 && (
            <div ref={selectMenuRef} className='multiple-select-list-options-menu'>
              {selectList.restSelectList.map(item => {
                return (
                  <MenuItem size='medium' onClick={() => handleSelectItem(item)} key={item.value}>
                    {item.display}
                  </MenuItem>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default MultipleSelectList
