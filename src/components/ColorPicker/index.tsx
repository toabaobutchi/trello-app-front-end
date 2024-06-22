import { useState } from 'react'
import './ColorPicker.scss'
import { CustomizablePropType } from '@utils/types'

interface ColorPickerProps extends React.ComponentProps<'div'> {
  input?: React.ComponentProps<'input'>
  label?: CustomizablePropType
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
}

function ColorPicker({ label, onChange = () => {}, input, ...props }: ColorPickerProps) {
  const [color, setColor] = useState(input?.value ?? '#000000')
  const handleChangeColor = (e: React.ChangeEvent<HTMLInputElement>) => {
    setColor(e.target.value)
    onChange(e)
  }
  return (
    <>
      <div className={`color-picker ${props?.className ?? ''}`.trimEnd()} style={props?.style}>
        <label htmlFor={input?.id} style={label?.style} className={label?.className}>
          {label?.content}
        </label>
        <input {...input} type='color' value={color} onChange={handleChangeColor} />
      </div>
    </>
  )
}

export default ColorPicker
