import { FC } from 'react'

import { SalesWithProducts } from '@/types'

interface CoreDashboardProps {
  salesOfUser: Promise<SalesWithProducts[]>
}

const CoreDashboard: FC<CoreDashboardProps> = ({}) => {
  return <p> lol</p>
}

export default CoreDashboard
