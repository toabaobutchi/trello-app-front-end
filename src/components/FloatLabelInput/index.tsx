import { useState } from 'react'
import './FloatLabelInput.scss'

interface FloatLabelInputProps extends React.ComponentProps<'div'> {
  label?: React.ReactNode
  input?: React.ComponentProps<'input'>
  size?: 'small' | 'medium' | 'large'
  // eslint-disable-next-line no-unused-vars
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
}

function FloatLabelInput({ label = '', size = 'medium', input, onChange = () => {}, ...props }: FloatLabelInputProps) {
  if (input?.onChange) {
    console.warn('Do not use `onChange` event of input element, use `onChange` props of `FloatLabelInput` instead!')
  }
  if (input?.placeholder) {
    console.warn('Do not spectify `placeholder` attribute, use `label` props of `FloatLabelInput` instead')
  }
  if (!input?.id) {
    console.error('`input` has no `id` attribute')
  }
  const [text, setText] = useState(input?.value ?? '')
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value)
    onChange(e)
  }
  return (
    <>
      <div className={`input-group float-label ${size}-input ${props?.className ?? ''}`.trim()} style={props?.style}>
        <input {...input} placeholder=' ' value={text} onChange={handleChange} />
        <label htmlFor={input?.id ?? ''}>{label}</label>
      </div>
    </>
  )
}

export default FloatLabelInput
