import { FC } from 'react'

// import SEO_KEYWORDS from '@/constants/seo-keywords'

export const metadata = {
  title: 'Test your knowledge | CountryPedia',
  // keywords: SEO_KEYWORDS,
  keywords: ['hi'],
  description:
    'Test your knowledge and challenge yourself with our range of interactive quiz games! Try to locate randomly generated countries on a map, find their capitals...',
}

interface LayoutProps {
  children: React.ReactNode
}

const CartLayout: FC<LayoutProps> = ({ children }) => {
  return <section className="p-3">{children}</section>
}

export default CartLayout
