import { useState } from 'react'
import './Input.scss'
import CustomizablePropType from '@utils/CustomizablePropType'

interface TextBoxProps extends React.ComponentProps<'input'> {
  inputSize?: 'small' | 'medium' | 'large'
  label?: CustomizablePropType
  sameLine?: boolean
}

function TextBox({
  value = '',
  label,
  inputSize = 'medium',
  sameLine = false,
  onChange = () => {},
  ...props
}: TextBoxProps) {
  const [text, setText] = useState(value ?? '')
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value)
    onChange(e)
  }
  return (
    <>
      <div className={`input-group ${inputSize}-input${sameLine ? ' same-line-label-input' : ''}`}>
        <label className={label?.className} htmlFor={props?.id} style={label?.style}>
          {label?.content}
        </label>
        <input value={text} onChange={handleChange} {...props} placeholder=' ' />
      </div>
    </>
  )
}

interface CheckBoxProps extends React.ComponentProps<'input'> {
  children?: React.ReactNode
  label?: Omit<CustomizablePropType, 'content'>
  borderTheme?: {
    onChecked?: 'success' | 'warning' | 'danger' | 'primary' | 'info' | 'light' | 'secondary' | string
    normal?: 'success' | 'warning' | 'danger' | 'primary' | 'info' | 'light' | 'secondary' | string
    applyToForeground?: boolean
  }
}

function CheckBox({ children = '', label, borderTheme, ...props }: CheckBoxProps) {
  const [checked, setChecked] = useState(props?.checked ?? false)
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(e.target.checked)
    props?.onChange?.(e)
  }
  return (
    <>
      <div
        className={`input-checkbox ${borderTheme?.onChecked ?? 'primary'}-checked ${
          borderTheme?.normal ?? 'light'
        }-border${borderTheme?.applyToForeground ? ' apply-text-color' : ''}`}
      >
        <input {...props} type='checkbox' checked={checked} onChange={handleChange} />
        <label htmlFor={props?.id} style={label?.style} className={label?.className}>
          {children}
        </label>
      </div>
    </>
  )
}

const Input = {
  TextBox,
  CheckBox
}

export default Input
