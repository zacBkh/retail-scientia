import { FC } from 'react'

interface OverlayDarkenerProps {
  isActive: boolean
  zIndex: string
}

const OverlayDarkener: FC<OverlayDarkenerProps> = ({ isActive, zIndex }) => {
  return (
    <div
      className={`${zIndex} overlayDarkenerBase ${
        isActive ? `overlayDarkenerActive ` : ''
      }`}
    ></div>
  )
}

export default OverlayDarkener
