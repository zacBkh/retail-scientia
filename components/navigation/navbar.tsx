'use client'

import { FC, useState } from 'react'

import Link from 'next/link'
import Image from 'next/image'

import HamburgerIcon from './hamburger-icon'
import HamburgerMenu from './hamburger-menu'

import { APP_LINKS } from '@/constants/URLs'

import CartNavbarIcon from '../cart/cart-navbar-icon'

import type { Session } from 'next-auth'
import OverlayDarkener from '../ui/overlay-darkener'

import getCloudiImg from '@/utils/transform-cloudi-img'

interface NavbarProps {
  session: Session | null
}

const Navbar: FC<NavbarProps> = ({ session }) => {
  const [isHamburgerMenuOpen, setIsHamburgerMenuOpen] = useState(false)

  const handleToggleHamburgerMenu = () => {
    setIsHamburgerMenuOpen((prev) => !prev)
  }

  const name = session?.user?.name
  const brandLogo = session?.user.brands[0].logo

  return (
    <>
      <OverlayDarkener zIndex="z-10" isActive={isHamburgerMenuOpen} />
      <div
        id="navbar"
        className="sticky top-0 z-[999999] bg-gray-400 dark:bg-[#232730] sm:transparent-navbar"
      >
        <header className="shadow-lg dark:shadow-slate-50/5 shadow-slate-950/10 sticky top-0 z-[999] w-full text-lg !text-[#404756] dark:!text-[#EBECF0]">
          <div className="flex gap-x-6 justify-between items-center p-2">
            <div className="flex items-center gap-x-3 py-2">
              <Link href={`${APP_LINKS.HOME}`}>
                <div id="logo" className="flex items-center gap-x-2 font-bold">
                  <span className="text-xs">
                    Retail
                    <span className="text-orange-200">Scientia</span>
                  </span>
                </div>
              </Link>
              <div>
                {brandLogo ? (
                  <Image
                    priority
                    width={40}
                    height={40}
                    src={getCloudiImg(undefined, brandLogo)}
                    alt="Brand Logo"
                  />
                ) : (
                  ''
                )}
              </div>
            </div>

            <div className="flex justify-between items-center gap-x-4">
              {session ? <div className="text-xs">{`Hi, ${name}`}</div> : ''}

              <Link href={APP_LINKS.DASHBOARD}>Dash</Link>
              <Link href={APP_LINKS.CART}>
                <CartNavbarIcon />
              </Link>
              <HamburgerIcon
                onToggleMenu={handleToggleHamburgerMenu}
                isHamburgerMenuOpen={isHamburgerMenuOpen}
              />
            </div>
          </div>
        </header>
        <HamburgerMenu
          isOpen={isHamburgerMenuOpen}
          onToggleMenu={handleToggleHamburgerMenu}
        />
      </div>
    </>
  )
}

export default Navbar
