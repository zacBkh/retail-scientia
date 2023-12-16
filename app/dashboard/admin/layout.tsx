import { FC } from 'react'

// import SEO_KEYWORDS from '@/constants/seo-keywords'

import { getServerSession } from 'next-auth'
import { authOptions } from '../../api/auth/[...nextauth]/route'

import { AccountType } from '@prisma/client'
const { Admin, Staff } = AccountType

export const metadata = {
  title: 'Cart | RetailScientia',
  // keywords: SEO_KEYWORDS,
  keywords: ['hi'],
  description: 'xx...',
}

interface LayoutProps {
  children: React.ReactNode
}

const CartLayout: FC<LayoutProps> = async ({ children }) => {
  const currentSession = await getServerSession(authOptions)

  const accountType = currentSession?.user?.accountType

  if (accountType === Admin) {
    return <section className="flex flex-col gap-y-6">{children}</section>
  }
  if (accountType === Staff) {
    return <p>Staff, not allowed</p>
  }
}

export default CartLayout
