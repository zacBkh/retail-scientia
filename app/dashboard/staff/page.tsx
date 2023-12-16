import { getServerSession } from 'next-auth'
import { authOptions } from '../../api/auth/[...nextauth]/route'

import { DashboardClientWrapper, AdminDashboard } from '@/components/dashboards'

import { AccountType } from '@prisma/client'
import { getPOS } from '@/services/prisma-queries'
const { Admin, Staff } = AccountType

const Dashboard = async () => {
  return (
    <>
      <p>Your staff</p>
    </>
  )
}

export default Dashboard
