import { FC } from 'react'

interface SpinnerProps {
  size?: string // !w-5 !h-5
  border?: string // border-t-red
  otherCSS?: string

  isFullPage?: boolean
  text?: string
}

const Spinner: FC<SpinnerProps> = ({
  size = 'w-10 h-10',
  border = 'border-t-black',
  otherCSS,
  isFullPage,
  text,
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center gap-y-1 ${
        isFullPage ? 'gap-4 h-[90vh]' : ''
      }`}
    >
      {text && (
        <p className={`${isFullPage ? 'text-xl font-semibold' : 'text-sm'}`}>
          {text}
        </p>
      )}
      <div
        className={`${size} ${border} ${
          otherCSS ?? ''
        } bg-white-700 inline-block border-2 rounded-[50%] animate-spin ease-in-out`}
      ></div>
    </div>
  )
}

export default Spinner
