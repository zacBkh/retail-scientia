import { FC } from 'react'

interface OverlayDarkenerProps {
  isActive: boolean
}

const OverlayDarkener: FC<OverlayDarkenerProps> = ({ isActive }) => {
  if (!isActive) return
  return <div className="overlayDarkener"></div>
}

export default OverlayDarkener
