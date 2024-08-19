type RenderIfProps = {
  check: boolean
  children: React.ReactNode
}

function RenderIf({ check, children }: RenderIfProps) {
  return check ? <>{children}</> : null
}

export default RenderIf
