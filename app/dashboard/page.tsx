import { getServerSession } from 'next-auth'
import { authOptions } from '../api/auth/[...nextauth]/route'

import DashboardClientWrapper from '@/components/dashboard/client-wrapper-dashboard'

const Dashboard = async () => {
  const currentSession = await getServerSession(authOptions)
  console.log('currentSession from server dashboard', currentSession?.user.id)

  return (
    <>
      <DashboardClientWrapper
        currentSession={currentSession}
        // totalSalesOfUser={totalSalesOfUser}
      />
    </>
  )
}

export default Dashboard
