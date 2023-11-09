import { FC } from 'react'

interface DividerProps {
  style?: string
  vertical?: boolean
}

const Divider: FC<DividerProps> = ({ style, vertical }) => {
  return (
    <div
      className={`${vertical ? 'border-r h-16' : 'border-b'} border-[#e4e4e4] ${
        style ?? ''
      }`}
    ></div>
  )
}

export default Divider
