import { FC } from 'react'

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/shad/ui/avatar'

interface ModelItemProps {
  line1: string
  line2: string
  line3?: string

  image?: string
}

const ModelItem: FC<ModelItemProps> = ({ line1, line2, line3 }) => {
  return (
    <>
      <div className="flex items-center text-sm">
        <Avatar className="h-9 w-9">
          <AvatarImage src="/avatars/01.png" alt="Avatar" />
          <AvatarFallback>DDF</AvatarFallback>
        </Avatar>
        <div className="flex flex-col ml-4">
          <p className="font-semibold leading-none">{line1}</p>
          <p>{line2}</p>
        </div>
        <div className="ml-auto">{line3}</div>
      </div>
    </>
  )
}

export default ModelItem
