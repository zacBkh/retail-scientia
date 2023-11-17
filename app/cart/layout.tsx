import { FC } from 'react'

import { Text } from '@radix-ui/themes'
// import SEO_KEYWORDS from '@/constants/seo-keywords'

export const metadata = {
  title: 'Cart | RetailScientia',
  // keywords: SEO_KEYWORDS,
  keywords: ['hi'],
  description:
    'Test your knowledge and challenge yourself with our range of interactive quiz games! Try to locate randomly generated countries on a map, find their capitals...',
}

interface LayoutProps {
  children: React.ReactNode
}

const CartLayout: FC<LayoutProps> = ({ children }) => {
  return (
    <section className="px-2 py-6 flex flex-col gap-y-6">{children}</section>
  )
}

export default CartLayout
