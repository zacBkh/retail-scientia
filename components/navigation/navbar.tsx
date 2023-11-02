'use client'
import { FC, useState } from 'react'

import Link from 'next/link'
import Image from 'next/image'

import { BsCart2 } from 'react-icons/bs'

import HamburgerIcon from './hamburger-icon'
import HamburgerMenu from './hamburger-menu'

import { APP_LINKS } from '@/constants/URLs'

// import Logo from '@images/countrypedia-logo.png'
// import { APP_LINKS } from '@/constants/urls'

// import NavLinks from './nav-links'
// import HamburgerIcon from './hamburger-icon'
// import HamburgerMenu from './hamburger-menu'

//

const Navbar = () => {
  const [isHamburgerMenuOpen, setIsHamburgerMenuOpen] = useState(false)

  const handleToggleHamburgerMenu = () => {
    setIsHamburgerMenuOpen((prev) => !prev)
  }

  return (
    <div
      id="navbar"
      className="sticky top-0 z-[999999] bg-gray-400 dark:bg-[#232730] sm:transparent-navbar"
    >
      <header className="shadow-lg dark:shadow-slate-50/5 shadow-slate-950/10 sticky top-0 z-[999] w-full text-lg !text-[#404756] dark:!text-[#EBECF0]">
        <div className="flex gap-x-6 justify-between items-center py-2 px-4">
          <div>
            <Link href={`${APP_LINKS.HOME}`}>
              <div id="logo" className="flex items-center gap-x-2 font-bold">
                {/* <Image
                  className="!w-8 sm:!w-10 outline outline-offset-2 outline-[1.5px] outline-react-button-blue-light rounded-full"
                  src={Logo}
                  alt="CountryPedia logo"
                /> */}
                <span className="text-sm sm:text-base">
                  Retail
                  <span className="text-orange-200">Scientia</span>
                </span>
              </div>
            </Link>
          </div>
          {/* <div className="hidden md:flex items-center gap-x-6 w-[80%]">
            <SearchBar trad={placeholderSearch} />
            <NavLinks navItemsTrad={navItems} currentLang={lang} />
          </div> */}

          <div className="flex justify-between items-center gap-x-4">
            <Link href={APP_LINKS.CART}>
              <BsCart2 className={'text-xl'} />
            </Link>
            <HamburgerIcon
              onToggleMenu={handleToggleHamburgerMenu}
              isHamburgerMenuOpen={isHamburgerMenuOpen}
            />
          </div>
        </div>
      </header>
      <HamburgerMenu isOpen={isHamburgerMenuOpen} />
    </div>
  )
}

export default Navbar
