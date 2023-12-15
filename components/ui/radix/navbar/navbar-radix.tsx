'use client'

import { FC, useState } from 'react'

import React from 'react'
import * as NavigationMenu from '@radix-ui/react-navigation-menu'
import { Separator } from '@radix-ui/themes'
import classNames from 'classnames'
import './styles.css'

import Link from 'next/link'

import CartNavbarIcon from '@/components/cart/cart-navbar-icon'

import { APP_LINKS, zIndexes } from '@/constants'

import { signOut } from 'next-auth/react'

import { PiCaretDownLight } from 'react-icons/pi'
import { RiDashboard3Line } from 'react-icons/ri'
import { AiOutlineUser } from 'react-icons/ai'
import { GoSignOut } from 'react-icons/go'

import Image from 'next/image'

import type { Session } from 'next-auth'

import getCloudiImg from '@/utils/transform-cloudi-img'

import OverlayDarkener from '../../overlay-darkener'

interface NavbarRxProps {
  session: Session | null
}

const NavbarRx: FC<NavbarRxProps> = ({ session }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const brandName = session?.user.brands[0].name
  const brandLogo = session?.user.brands[0].logo

  const userName = session?.user?.name

  return (
    <>
      <OverlayDarkener
        zIndex={zIndexes.OVERLAY_DATEPICKER_NAVBAR}
        isActive={isMenuOpen}
      />

      <NavigationMenu.Root
        onValueChange={(open) => {
          setIsMenuOpen(open.length ? true : false)
        }}
        className={`NavigationMenuRoot ${
          zIndexes.NAVBAR
        } transparent-navbar shadow-md ${isMenuOpen ? '!bg-white' : ''}`}
      >
        <NavigationMenu.List className="NavigationMenuList !items-center">
          <Link
            className="NavigationMenuTrigger hover:!bg-transparent hover:!shadow-none"
            href={APP_LINKS.HOME}
          >
            RetailScientia
          </Link>

          <div className="flex items-center" id="rest">
            {/* More dropdown */}
            <div className="w-full flex justify-end items-center">
              <NavigationMenu.Item>
                <NavigationMenu.Trigger className="NavigationMenuTrigger">
                  More <PiCaretDownLight className="CaretDown" aria-hidden />
                </NavigationMenu.Trigger>
                <NavigationMenu.Content
                  onInteractOutside={() => setIsMenuOpen(false)}
                  className="NavigationMenuContent"
                >
                  <ul className="List one">
                    <li style={{ gridRow: 'span 3' }}>
                      <NavigationMenu.Link asChild>
                        <Link className="Callout" href={APP_LINKS.HOME}>
                          <div className="h-[57px]">
                            {brandLogo ? (
                              <Image
                                className="mx-auto"
                                width={100}
                                height={100}
                                src={getCloudiImg(undefined, brandLogo)}
                                alt="Brand Logo"
                              />
                            ) : (
                              <div className="h-[57px]"></div>
                            )}
                          </div>

                          <div className="CalloutHeading">{brandName}</div>
                          <p className="CalloutText">Welcome, {userName}</p>
                        </Link>
                      </NavigationMenu.Link>
                    </li>

                    <ListItem
                      link={APP_LINKS.DASHBOARD}
                      title="Dashboard"
                      icon={<RiDashboard3Line />}
                    >
                      See your performance.
                    </ListItem>

                    <ListItem link="/" title="Profile" icon={<AiOutlineUser />}>
                      Check your profile.
                    </ListItem>

                    <div>
                      <Separator mb={'3'} size="4" />

                      <ListItem
                        isBtnSignOut
                        title="Sign Out"
                        icon={<GoSignOut />}
                      />
                    </div>
                  </ul>
                </NavigationMenu.Content>
              </NavigationMenu.Item>
            </div>

            <div className="flex items-center">
              {/* Greet */}
              <p className="whitespace-nowrap NavigationMenuTrigger hover:!bg-transparent hover:!shadow-none !text-xs">
                Hi, {userName}
              </p>

              {/* Cart */}
              <Link href={APP_LINKS.CART}>
                <NavigationMenu.Item className="NavigationMenuLink">
                  <CartNavbarIcon />
                </NavigationMenu.Item>
              </Link>
            </div>
          </div>
        </NavigationMenu.List>

        <div className="ViewportPosition !left-0 lg:!left-[55px] z-[150]">
          <NavigationMenu.Viewport className="NavigationMenuViewport" />
        </div>
      </NavigationMenu.Root>
    </>
  )
}

const ListItem = React.forwardRef<
  HTMLAnchorElement,
  {
    className?: string
    children?: React.ReactNode
    link?: string
    title: string
    icon?: React.ReactNode
    isBtnSignOut?: boolean
  }
>(({ className, children, title, link, icon, isBtnSignOut }, forwardedRef) => {
  if (isBtnSignOut) {
    return (
      <button onClick={() => signOut()} className="ListItemLink">
        <div className="flex items-center gap-x-2">
          <p className="ListItemHeading">Sign Out</p>
          <div>{icon}</div>
        </div>
      </button>
    )
  }

  return (
    <li>
      <NavigationMenu.Link asChild>
        <Link
          ref={forwardedRef}
          className={classNames('ListItemLink', className)}
          href={link ?? ''}
        >
          <div className="flex flex-col">
            <div className="flex items-center gap-x-2">
              <div className="ListItemHeading">{title}</div>
              <div>{icon}</div>
            </div>
            <p className="ListItemText">{children}</p>
          </div>
        </Link>
      </NavigationMenu.Link>
    </li>
  )
})

export default NavbarRx
