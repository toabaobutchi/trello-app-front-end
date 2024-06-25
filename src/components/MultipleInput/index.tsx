import './MultipleInput.scss'

type MultipleInputProps = {
  label?: React.ReactNode
  value?: string[]
}

function MultipleInput(props: MultipleInputProps) {
  return <>
    <div className='multiple-input'>
      <label htmlFor="">{props.label}</label>
    </div>
  </>
}

export default MultipleInput;