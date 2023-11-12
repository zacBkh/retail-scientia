'use client'

import { useState, useEffect } from 'react'
import Datepicker from 'react-tailwindcss-datepicker'

import { DateValueType } from 'react-tailwindcss-datepicker'

import useSWR, { mutate } from 'swr'

import { getDateLS } from '@/utils/local-storage'

import SWR_KEYS from '@/constants/SWR-keys'
import { ListFormat } from 'typescript'

const DatePickerNewSale = () => {
  const {
    data: dateInLS,
    error,
    isLoading,
    isValidating,
  } = useSWR(SWR_KEYS.GET_DATE_LS, () => getDateLS(), {
    revalidateOnMount: true,
  })

  const [datesObject, setDatesObject] = useState<DateValueType>({
    startDate: new Date(),
    endDate: new Date(),
  })

  const [isDatePickerBumping, setIsDatePickerBumping] = useState(false)

  // Formatting the date and adding it to LS on state change
  useEffect(() => {
    const dateFromState = datesObject?.startDate as string // will be like '2023-11-05'
    localStorage.setItem('date', dateFromState ?? '')
    mutate(SWR_KEYS.GET_DATE_LS)
  }, [datesObject?.startDate])

  const handleValueChange = (newValue: DateValueType) => {
    setDatesObject(newValue)
    mutate(SWR_KEYS.GET_DATE_LS)
  }

  useEffect(() => {
    setIsDatePickerBumping(true)

    const timer = setTimeout(() => {
      setIsDatePickerBumping(false)
    }, 400)

    return () => {
      clearTimeout(timer)
    }
  }, [isValidating])

  return (
    <div>
      <Datepicker
        startWeekOn="mon"
        readOnly={true}
        inputClassName={`${
          isDatePickerBumping ? 'bump' : ''
        } w-[87vw] h-[40px] !bg-purple-100 !rounded-lg  relative transition-all duration-300 py-2.5 pl-4 pr-14 w-full border-gray-300 dark:bg-slate-800 dark:text-white/80 dark:border-slate-600  tracking-wide font-light  placeholder-gray-400 focus:ring disabled:opacity-40 disabled:cursor-not-allowed focus:border-purple-500 focus:ring-purple-500/20`}
        placeholder="Select the day you did the sale"
        primaryColor={'purple'}
        useRange={false}
        asSingle={true}
        value={datesObject}
        onChange={handleValueChange}
        maxDate={new Date()}
      />
    </div>
  )
}

DatePickerNewSale.displayName = 'DatePickerNewSale'

export default DatePickerNewSale
