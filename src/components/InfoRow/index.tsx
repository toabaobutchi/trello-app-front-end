import './InfoRow.scss'

interface InfoRowProps {
  layout?: {
    imgColor?: string
    mainContent?: string
    subContent?: string
    actions?: React.ReactNode
  }
}

function InfoRow({ layout }: InfoRowProps) {
  return (
    <>
      <div className='info-row' style={{ ['--color']: layout?.imgColor } as React.CSSProperties}>
        <div className='info-row-img'>{layout?.mainContent?.charAt(0)}</div>
        <div className='info-row-content'>
          <div className='info-row-content-main'>{layout?.mainContent}</div>
          <div className='info-row-content-sub'>{layout?.subContent}</div>
        </div>
        <div className='info-row-actions'>{layout?.actions}</div>
      </div>
    </>
  )
}

export default InfoRow
