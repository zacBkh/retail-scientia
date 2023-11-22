import { FC } from 'react'
import Spinner from '@/components/ui/spinner'

interface LoadingViewServerProps {
  text: string
}

const LoadingViewServer: FC<LoadingViewServerProps> = ({ text }) => {
  return (
    <div className="flex flex-col items-center justify-center gap-4 h-[90vh]">
      <p className="text-xl font-semibold">{text}</p>
      <Spinner style="border-t-black !w-10 !h-10" />
    </div>
  )
}

export default LoadingViewServer
