import { FC } from 'react'

import { FaLongArrowAltDown } from 'react-icons/fa'

interface ShowMoreButtonDashboardProps {
  onToggleBtn: (newShowQty: boolean) => void
  isExpandedView: boolean
  isSalesEmpty: boolean
}

const ShowMoreButtonDashboard: FC<ShowMoreButtonDashboardProps> = ({
  onToggleBtn,
  isExpandedView,
  isSalesEmpty,
}) => {
  if (isSalesEmpty) {
    return <p className="block text-center">Not much to show here! 😭</p>
  }

  return (
    <>
      <button
        onClick={() => onToggleBtn(isExpandedView ? false : true)}
        className="text-sm font-semibold inline-flex justify-end items-center gap-x-2"
      >
        {`Show ${!isExpandedView ? 'more' : 'less'}`}
        <FaLongArrowAltDown
          className={`transition-transform duration-200 ${
            !isExpandedView ? 'rotate-0' : '-rotate-180'
          }`}
        />
      </button>
    </>
  )
}

export default ShowMoreButtonDashboard
