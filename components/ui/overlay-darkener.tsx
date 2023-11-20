import { FC } from 'react'

interface OverlayDarkenerProps {
  isActive: boolean
  zIndex: string
}

const OverlayDarkener: FC<OverlayDarkenerProps> = ({ isActive, zIndex }) => {
  return (
    <div
      className={`transition-all duration-200 ease-in-out ${
        isActive ? `overlayDarkener ${zIndex}` : 'killOverlayDarkener'
      }`}
    ></div>
  )
}

export default OverlayDarkener
