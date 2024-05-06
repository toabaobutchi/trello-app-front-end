import './ImageBox.scss'

interface ImageBoxProps {
  src: string
  caption?: {
    content?: React.ReactNode
    style?: React.CSSProperties
    classes?: string
  }
  imageAlign?: 'left' | 'center' | 'right'
}

function ImageBox({ src = '', caption = undefined, imageAlign = 'center' }: ImageBoxProps) {
  return (
    <>
      <div className={`image-box ${imageAlign}-image`}>
        <img src={src} />
        <div className={`image-box-caption ${caption?.classes}`} style={caption?.style}>{caption?.content}</div>
      </div>
    </>
  )
}

export default ImageBox
