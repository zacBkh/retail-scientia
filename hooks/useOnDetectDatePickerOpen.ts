import { useEffect, useState } from 'react'

const useOnDetectDatePickerOpen = () => {
  const [isDatePickerOpen, setDatePickerOpen] = useState(false)

  const handleClickOnPage = () => {
    setTimeout(() => {
      const datePickerIsOpen = document.querySelector(
        'div.block.translate-y-0.opacity-1.block'
      )
      if (datePickerIsOpen) {
        setDatePickerOpen(true)
      } else {
        setDatePickerOpen(false)
      }
    }, 20)
  }

  useEffect(() => {
    document.addEventListener('click', handleClickOnPage)

    return () => {
      document.removeEventListener('click', handleClickOnPage)
    }
  }, [])

  return isDatePickerOpen
}

export default useOnDetectDatePickerOpen
