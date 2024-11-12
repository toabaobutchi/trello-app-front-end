import './ImagesStack.scss'

// type ImageConfigs = {
//   className?: string
//   style?: React.CSSProperties
// }

type DivComponentProps = React.ComponentProps<'div'>

function ImagesStack({ children, ...props }: DivComponentProps) {
  // display = display === undefined || display <= 0 ? undefined : display
  // const restCount = display ? sources.length - display : 0
  return (
    <div {...props} className={`images-stack image__circle d-flex ${props?.className}`}>
      {/* {sources.slice(0, display).map((source, index) => (
        <img key={index} src={source} {...imageConfig} />
      ))}
      {restCount > 0 && <span className='images-stack-rest-count'>{restCount} more</span>} */}
      {children}
    </div>
  )
}

export default ImagesStack
