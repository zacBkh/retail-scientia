import { getServerSession } from 'next-auth'
import { authOptions } from '../api/auth/[...nextauth]/route'

import DashboardClientWrapper from '@/components/dashboard/client-wrapper-dashboard'

const Dashboard = async () => {
  const currentSession = await getServerSession(authOptions)

  return (
    <>
      <DashboardClientWrapper currentSession={currentSession} />
    </>
  )
}

export default Dashboard
