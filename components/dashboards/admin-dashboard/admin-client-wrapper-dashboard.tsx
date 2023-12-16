import { FC } from 'react'

import type { PointOfSale } from '@prisma/client'

interface AdminDashboardProps {
  allPOS: PointOfSale[] | undefined
}

const AdminDashboard: FC<AdminDashboardProps> = ({ allPOS }) => {
  return (
    <>
      <p>Admin Dashboard</p>
    </>
  )
}

export default AdminDashboard
