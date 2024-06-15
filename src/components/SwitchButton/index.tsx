import { useState } from 'react'
import './SwitchButton.scss'

interface SwitchInputType extends React.ComponentProps<'input'> {
  type?: 'radio' | 'checkbox'
}

interface SwitchButtonProps {
  inputAttributes?: SwitchInputType
  label?: { content: React.ReactNode; style?: React.CSSProperties }
  size?: 'tiny' | 'small' | 'normal' | 'medium' | 'large'
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  icon?: { checked?: React.ReactNode; unchecked?: React.ReactNode }
}

function SwitchButton({
  label,
  inputAttributes = {},
  size = 'normal',
  icon = {checked: <i className='fa-solid fa-check'></i>, unchecked: <i className='fa-solid fa-xmark'></i>},
  onChange
}: SwitchButtonProps) {
  const { checked = false, ...attrs } = inputAttributes
  const [selected, setSelected] = useState<boolean>(checked)
  const handleCheck = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelected(e.currentTarget.checked)
    onChange?.(e)
  }
  return (
    <>
      <div className={`switch-btn ${size}-switch-btn`}>
        <input {...attrs} checked={selected} onChange={handleCheck} />
        <label htmlFor={inputAttributes?.id} style={label?.style}>
          <span className='slider'>
            {selected ? (
              icon?.checked
            ) : (
              icon?.unchecked
            )}
          </span>
        </label>
      </div>
    </>
  )
}

export default SwitchButton
