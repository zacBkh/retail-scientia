'use client'

import { FC } from 'react'
import Link from 'next/link'

import { APP_LINKS, DASHBOARD_LINKS } from '@/constants'

interface LayoutProps {
  children: React.ReactNode
}

import { usePathname } from 'next/navigation'

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/shad/ui/sheet'

import { Menu } from 'lucide-react'

const CartLayout: FC<LayoutProps> = ({ children }) => {
  const pathname = usePathname()

  const commonLinkStyle =
    'flex gap-x-2 font-semibold text-sm py-2 px-4 rounded-lg'

  return (
    <div className="p-3 ">
      <Sheet modal={false}>
        <SheetTrigger className="underline active:transform-none">
          <Menu />
        </SheetTrigger>
        <SheetContent side={'left'} className="bg-[#1C2536]">
          <div className="flex flex-col gap-y-5">
            <SheetHeader className="mb-4 text-lg font-semibold text-white">
              Dashboard Menu
            </SheetHeader>

            <div className="text-[#9DA4AE] flex flex-col gap-y-2">
              {DASHBOARD_LINKS.map((link) => (
                <Link
                  key={link.displayName}
                  className={`${commonLinkStyle} ${
                    pathname === link.link ? 'drawerLinkActive' : ''
                  }`}
                  href={link.link}
                >
                  <div className="flex items-center gap-x-3">
                    <span
                      className={`${
                        pathname === link.link ? 'text-[#6550b9]' : ''
                      } `}
                    >
                      {link.icon}
                    </span>
                    {link.displayName}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </SheetContent>
      </Sheet>

      <section className="px-2 py-6 flex flex-col gap-y-6">{children}</section>
    </div>
  )
}

export default CartLayout
