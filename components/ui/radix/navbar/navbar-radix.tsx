'use client'

import { FC, useState } from 'react'

import React from 'react'
import * as NavigationMenu from '@radix-ui/react-navigation-menu'
import classNames from 'classnames'
import './styles.css'

import Link from 'next/link'

import CartNavbarIcon from '@/components/cart/cart-navbar-icon'

import { APP_LINKS } from '@/constants/URLs'

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

  console.log('isMenuOpen', isMenuOpen)
  return (
    <>
      {isMenuOpen ? <OverlayDarkener isActive={true} /> : ''}

      <NavigationMenu.Root
        onValueChange={(open) => {
          setIsMenuOpen(open.length ? true : false)
        }}
        className="NavigationMenuRoot"
      >
        <NavigationMenu.List className="NavigationMenuList !items-center">
          <NavigationMenu.Item>
            <NavigationMenu.Trigger className="NavigationMenuTrigger">
              Profile <PiCaretDownLight className="CaretDown" aria-hidden />
            </NavigationMenu.Trigger>
            <NavigationMenu.Content
              onInteractOutside={() => setIsMenuOpen(false)}
              className="NavigationMenuContent"
            >
              <ul className="List one">
                <div>
                  <li style={{ gridRow: 'span 3' }}>
                    <NavigationMenu.Link asChild>
                      <a className="Callout" href="/">
                        {brandLogo ? (
                          <Image
                            className="mx-auto"
                            width={100}
                            height={100}
                            src={getCloudiImg(undefined, brandLogo)}
                            alt="Brand Logo"
                          />
                        ) : (
                          ''
                        )}

                        <div className="CalloutHeading">{brandName}</div>
                        <p className="CalloutText">Welcome, {userName}</p>
                      </a>
                    </NavigationMenu.Link>
                  </li>
                </div>

                <div>
                  <ListItem
                    link="/"
                    title="Dashboard"
                    icon={<RiDashboard3Line />}
                  >
                    See your performance.
                  </ListItem>

                  <ListItem link="/" title="Profile" icon={<AiOutlineUser />}>
                    Check your profile.
                  </ListItem>

                  <ListItem
                    isBtnSignOut
                    title="Sign Out"
                    icon={<GoSignOut />}
                  />
                </div>
              </ul>
            </NavigationMenu.Content>
          </NavigationMenu.Item>

          {/* Cart */}
          <Link href={APP_LINKS.CART}>
            <NavigationMenu.Item className="NavigationMenuLink">
              <CartNavbarIcon />
            </NavigationMenu.Item>
          </Link>
        </NavigationMenu.List>

        <div className="ViewportPosition">
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
