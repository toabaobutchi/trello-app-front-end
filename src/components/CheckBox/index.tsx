import { useState } from 'react'
import './CheckBox.scss'

type IconType = {
  icon: React.ReactNode
  color?: string
}

interface CheckBoxProps {
  inputAttrs?: React.ComponentProps<'input'>
  icons?: {
    checked?: IconType
    unchecked?: IconType
  }
  // eslint-disable-next-line no-unused-vars
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
}

function CheckBox({
  inputAttrs = {},
  icons = {
    checked: { icon: <i className='fa-solid fa-circle-check'></i> },
    unchecked: { icon: <i className='fa-regular fa-circle'></i> }
  },
  onChange = () => {}
}: CheckBoxProps) {
  const [checked, setChecked] = useState(Boolean(inputAttrs?.checked))
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(e.currentTarget.checked)
    onChange(e)
  }
  return (
    <>
      <div className='checkbox'>
        <input type='checkbox' {...inputAttrs} checked={checked} onChange={handleChange} />
        <label htmlFor={inputAttrs?.id ?? ''}>
          {checked && (
            <span className='checked-label' style={{ ['--color']: icons?.checked?.color } as React.CSSProperties}>
              {icons?.checked?.icon}
            </span>
          )}
          {!checked && (
            <span className='unchecked-label' style={{ ['--color']: icons?.unchecked?.color } as React.CSSProperties}>
              {icons?.unchecked?.icon}
            </span>
          )}
        </label>
      </div>
    </>
  )
}

export default CheckBox
