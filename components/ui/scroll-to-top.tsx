import { BsFillArrowUpCircleFill } from 'react-icons/bs'
import { FC } from 'react'

interface ScrollToTopBtnProps {
  iconStyle: string
  className: string
  shouldBounce?: boolean
}

const ScrollToTopBtn: FC<ScrollToTopBtnProps> = ({
  iconStyle,
  className,
  shouldBounce,
}) => {
  return (
    <a
      aria-label="Go to the top of the page"
      href="#"
      className={`mt-auto drop-shadow-lg z-[999] ${className} 
            ${shouldBounce ? 'animate-bounce' : ''}`}
    >
      <BsFillArrowUpCircleFill className={`${iconStyle}`} />
    </a>
  )
}

export default ScrollToTopBtn
