'use client'

import { FC, useState } from 'react'
import Link from 'next/link'

import { DASHBOARD_LINKS } from '@/constants'

import { useSession } from 'next-auth/react'

interface LayoutProps {
  children: React.ReactNode
}

import { AccountType } from '@prisma/client'
const { Staff } = AccountType

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

  const { data: session } = useSession()
  const isStaff = session?.user?.accountType === Staff

  if (isStaff) {
    return <section className="flex flex-col gap-y-6">{children}</section>
  }

  const commonLinkStyle =
    'flex gap-x-2 font-semibold text-sm py-2 px-4 rounded-lg'

  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  return (
    <div className="p-3">
      <Sheet open={isDrawerOpen} onOpenChange={setIsDrawerOpen} modal={false}>
        <SheetTrigger className="underline active:transform-none">
          <Menu />
        </SheetTrigger>
        <SheetContent
          side={'left'}
          className="bg-[#1C2536] w-[220px] sm:w-[540px]"
        >
          <div className="flex flex-col gap-y-5">
            <SheetHeader className="mb-4 text-lg font-semibold text-white">
              Dashboard Menu
            </SheetHeader>

            <div className="text-[#9DA4AE] flex flex-col gap-y-2">
              {DASHBOARD_LINKS.map((link) => (
                <Link
                  onClick={() => setIsDrawerOpen(false)}
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

      <section className="flex flex-col gap-y-6">{children}</section>
    </div>
  )
}

export default CartLayout
