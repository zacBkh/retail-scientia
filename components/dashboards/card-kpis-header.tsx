import { FC } from 'react'

import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

interface CardHeaderKPIsProps {
  text: string
  value: string
  isLoading: boolean
}

const CardHeaderKPIs: FC<CardHeaderKPIsProps> = ({
  text,
  value,
  isLoading,
}) => {
  return (
    <div className="p-3 card-dashboard">
      <p className="text-sm font-bold">{text}</p>
      <p className="mx-auto block font-extrabold text-3xl text-gray-500">
        {isLoading ? <Skeleton /> : value}
      </p>
    </div>
  )
}

export default CardHeaderKPIs
