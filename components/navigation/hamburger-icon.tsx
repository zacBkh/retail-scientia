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
      <div className="hamburger-top"></div>
      <div className="hamburger-middle"></div>
      <div className="hamburger-bottom"></div>
    </button>
  )
}

export default HamburgerIcon
