import { getServerSession } from 'next-auth'
import { authOptions } from '../../api/auth/[...nextauth]/route'

import { DashboardClientWrapper, AdminDashboard } from '@/components/dashboards'

import { AccountType } from '@prisma/client'
const { Admin, Staff } = AccountType
import { getPOS } from '@/services/prisma-queries'

const Dashboard = async () => {
  const currentSession = await getServerSession(authOptions)

  const user = currentSession?.user
  const accountType = user?.accountType
  const userID = user?.id

  if (accountType === Admin) {
    const allPOS = await getPOS()
    return <AdminDashboard allPOS={allPOS} />
  }

  if (accountType === Staff) {
    return <DashboardClientWrapper currentSession={currentSession} />
  }
}

export default Dashboard