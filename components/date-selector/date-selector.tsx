'use client'

import { useEffect, useState, forwardRef, Ref } from 'react'
import DatePicker, { ReactDatePickerProps } from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

interface CustomInputProps {
  value?: string
  onClick?: () => void
}

// eslint-disable-next-line react/display-name
const ProductCard = ({}) => {
  const [startDate, setStartDate] = useState<Date>(new Date())

  const CustomInput = forwardRef(
    ({ value, onClick }: CustomInputProps, ref: Ref<HTMLButtonElement>) => (
      <button
        className="w-32 p-1 border border-sky-500 flex  items-center"
        onClick={onClick}
        ref={ref}
      >
        {value}
      </button>
    )
  )

  // Formatting the date and adding it to LS on state change
  useEffect(() => {
    if (!(startDate instanceof Date)) {
      return
    }
    // localStorage.setItem('date', format(startDate, 'dd/MM/yyyy'))
    localStorage.setItem('date', startDate.toISOString())
  }, [startDate])

  return (
    <DatePicker
      disabled={false}
      customInput={<CustomInput />}
      maxDate={new Date()}
      // dateFormat="dd/MM/yyyy"
      selected={startDate}
      onChange={(date) => setStartDate(date as Date)}
    />
  )
}

export default ProductCard
