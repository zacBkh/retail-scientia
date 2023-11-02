import { FC } from 'react'

// import NavLinks from './nav-links'

interface HamburgerMenuProps {
  isOpen: boolean
}

const HamburgerMenu: FC<HamburgerMenuProps> = ({ isOpen }) => {
  if (!isOpen) return

  //   const closeHamburgerMenuHandler = () => {
  //     setIsHamburgerMenuOpen(false)
  //   }
  return (
    <>
      <nav
        className={`z-[99999] py-8 md:hidden bg-white dark:bg-[#232730] w-screen absolute drop-shadow-2xl border-t-[#EBECF0] dark:border-t-[#232324] border-t-[2px]}`}
      >
        {/* <NavLinks
                    navItemsTrad={navItemsTrad}
                    isHamburgerMenu
                    isHamburgerMenuOpen={isHamburgerMenuOpen}
                    onHamburgerMenuClose={closeHamburgerMenuHandler}
                    currentLang={currentLang}
                /> */}
      </nav>
    </>
  )
}

export default HamburgerMenu
