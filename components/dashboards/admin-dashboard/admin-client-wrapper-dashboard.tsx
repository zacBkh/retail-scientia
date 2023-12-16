import { FC } from 'react'

interface AdminDashboardProps {
  a?: string
}

const AdminDashboard: FC<AdminDashboardProps> = ({ a }) => {
  return (
    <>
      <p>Hi you're an admin</p>
    </>
  )
}

export default AdminDashboard
