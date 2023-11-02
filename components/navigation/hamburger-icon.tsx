import { FC } from 'react'

interface HamburgerIconProps {
  isHamburgerMenuOpen: boolean
  onToggleMenu: () => void
}

const HamburgerIcon: FC<HamburgerIconProps> = ({
  isHamburgerMenuOpen,
  onToggleMenu,
}) => {
  // const { isHamburgerMenuOpen, setIsHamburgerMenuOpen } = useGlobalContext()

  return (
    <button
      onClick={onToggleMenu}
      // onClick={() => setIsHamburgerMenuOpen(prev => !prev)}
      // onClick={() => setIsHamburgerMenuOpen((prev) => !prev)}
      aria-label="Show hamburger menu"
      className={`${
        isHamburgerMenuOpen ? 'open' : ''
      } hamburger block md:hidden focus:outline-none h-fit hover:!bg-transparent `}
    >
      <span className="hamburger-top"></span>
      <span className="hamburger-middle"></span>
      <span className="hamburger-bottom"></span>
    </button>
  )
}

export default HamburgerIcon
