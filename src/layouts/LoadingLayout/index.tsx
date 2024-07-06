import './LoadingLayout.scss'

interface LoadingLayoutProps extends React.ComponentProps<'div'> {
  isLoading?: boolean
  children?: React.ReactNode
}

function LoadingLayout({ isLoading = false, children = '', ...props }: LoadingLayoutProps) {
  // const { style, className, ...restProps } = props
  return (
    <>
      {isLoading ? (
        <div {...props}>
          <div className='loader'></div>
        </div>
      ) : (
        <>{children}</>
      )}
    </>
  )
}

export default LoadingLayout
