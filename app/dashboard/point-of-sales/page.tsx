import { getServerSession } from 'next-auth'
import { authOptions } from '../../api/auth/[...nextauth]/route'

import { DashboardClientWrapper, AdminDashboard } from '@/components/dashboards'

import { AccountType } from '@prisma/client'
import { getPOS } from '@/services/prisma-queries'
const { Admin, Staff } = AccountType

const Dashboard = async () => {
  const currentSession = await getServerSession(authOptions)
  const user = currentSession?.user
  const accountType = user?.accountType
  const userID = user?.id

  const allPOS = await getPOS()

  return (
    <>
      {allPOS?.map((pos) => (
        <p key={pos.name}>{pos.name}</p>
      ))}
    </>
  )
}

export default Dashboard
