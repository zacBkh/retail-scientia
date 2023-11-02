// color should be "border-t-[color]"

import { FC } from 'react'

interface SpinnerProps {
  style: string
}

const Spinner: FC<SpinnerProps> = ({ style }) => {
  return (
    <div
      className={`${style} bg-white-700 inline-block w-5 h-5 border-2 rounded-[50%] animate-spin ease-in-out`}
    ></div>
  )
}

export default Spinner
