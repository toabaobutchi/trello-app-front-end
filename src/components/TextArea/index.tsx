import { useState } from 'react'
import './TextArea.scss'

interface TextAreaProps extends React.ComponentProps<'textarea'> {
  label?: string
}

function TextArea({ label = '', ...props }: TextAreaProps) {
  const [text, setText] = useState(props?.value ?? '')
  const handleChangeText = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value)
    props?.onChange?.(e)
  }
  return (
    <>
      <div className='text-area'>
        <label htmlFor={props?.id}>{label}</label>
        <textarea {...props} value={text} onChange={handleChangeText}></textarea>
      </div>
    </>
  )
}

export default TextArea
