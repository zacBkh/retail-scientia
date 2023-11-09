import { FC, useRef } from 'react'

// import NavLinks from './nav-links'

import { signOut } from 'next-auth/react'

import { GoSignOut } from 'react-icons/go'
import { AiOutlineUser } from 'react-icons/ai'
import { RiDashboard3Line } from 'react-icons/ri'

import useOnClickOutside from '@/hooks/useOnClickOutside'

import Divider from '../ui/divider'

interface HamburgerMenuProps {
  isOpen: boolean
  onToggleMenu: () => void
}

const HamburgerMenu: FC<HamburgerMenuProps> = ({ isOpen, onToggleMenu }) => {
  const popUpRef = useRef(null)
  useOnClickOutside(popUpRef, onToggleMenu)

  if (!isOpen) return

  //   const closeHamburgerMenuHandler = () => {
  //     setIsHamburgerMenuOpen(false)
  //   }
  return (
    <>
      <nav ref={popUpRef} className="relative">
        <div
          className={`z-[99999] flex flex-col gap-y-2 top-2 rounded-lg right-2 p-4 absolute md:hidden bg-white dark:bg-[#232730] w-1/2 drop-shadow-2xl border-t-[#EBECF0] dark:border-t-[#232324] border-t-[2px]}`}
        >
          <button
            className="flex items-center gap-x-3 w-full"
            // onClick={() => signOut()}
          >
            <AiOutlineUser />
            <span>Profile</span>
          </button>

          <button
            className="flex items-center gap-x-3 w-full"
            // onClick={() => signOut()}
          >
            <RiDashboard3Line />
            <span>Dashboard</span>
          </button>

          <Divider style="my-2" />

          <button
            className="flex items-center gap-x-3 w-full"
            onClick={() => signOut()}
          >
            <GoSignOut />
            <span>Sign Out</span>
          </button>
          {/* <NavLinks
                    navItemsTrad={navItemsTrad}
                    isHamburgerMenu
                    isHamburgerMenuOpen={isHamburgerMenuOpen}
                    onHamburgerMenuClose={closeHamburgerMenuHandler}
                    currentLang={currentLang}
                /> */}
        </div>
      </nav>
    </>
  )
}

export default HamburgerMenu
