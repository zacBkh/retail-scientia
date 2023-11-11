import { FC } from 'react'

import { Text } from '@radix-ui/themes'
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
  return (
    <section className="p-2 flex flex-col gap-y-6">
      <Text align={'center'}>Your Cart</Text>
      {/* <div className="flex justify-between text-xs border-b border-black pb-2 mt-2">
        <span className="w-[65%]">Products</span>
        <span className="w-[15%]">Quantity</span>
        <span className="w-[10%]">Price</span>
      </div> */}
      {children}
    </section>
  )
}

export default CartLayout
