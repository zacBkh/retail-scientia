'use client'

import { useState, useEffect, FC } from 'react'
import Datepicker from 'react-tailwindcss-datepicker'

import type { DateValueType, DateRangeType } from 'react-tailwindcss-datepicker'

import useSWR, { mutate } from 'swr'

import { getDateLS } from '@/utils/local-storage'

import SWR_KEYS from '@/constants/SWR-keys'
const { GET_DATE_LS, GET_SALES_OF_USER_DB } = SWR_KEYS

import { getUserSalesInDB } from '@/services/fetchers-api'

import type { Session } from 'next-auth'
import { APIResponseFindUserSales } from '@/types'

import { toast } from 'react-toastify'

import OverlayDarkener from '../ui/overlay-darkener'

import { dateToStringForQuery } from '@/utils/dates'

import { zIndexes } from '@/constants/z-indexes'

interface DatePickerNewSaleProps {
  currentSession: Session | null
}

const DatePickerNewSale: FC<DatePickerNewSaleProps> = ({ currentSession }) => {
  const {
    data: dateInLS,
    error,
    isLoading,
    isValidating,
  } = useSWR(GET_DATE_LS, () => getDateLS(), {
    revalidateOnMount: true,
  })

  const [datesObject, setDatesObject] = useState({
    // startDate: new Date(),
    // endDate: new Date(),

    startDate: dateToStringForQuery(new Date()),
    endDate: dateToStringForQuery(new Date()),
  })

  const checkIfAlreadySales = (data: APIResponseFindUserSales) => {
    console.log('data', data)
    if (datesObject?.startDate === null) {
      return toast.warn('Please select a date.', {
        autoClose: 7000,
      })
    }

    if (data.result.length) {
      return toast.warn('You already have sales registered for this day.', {
        autoClose: 7000,
        toastId: 'SALES_ALREADY_EXISTING',
      })
    }
  }

  const {
    data: userSales,
    error: errorUserSales,
    isLoading: isLoadingUserSales,
    isValidating: isValidatingUserSales,
  } = useSWR(
    GET_SALES_OF_USER_DB,
    () =>
      getUserSalesInDB([datesObject?.startDate, datesObject?.endDate ?? '']),
    {
      // revalidateIfStale: false,
      // revalidateOnFocus: false,
      // revalidateOnReconnect: false,
      onSuccess: (data, key, config) => checkIfAlreadySales(data),
    }
  )

  const handleValueChange = async (newValue: any) => {
    console.log('newValue', newValue)
    setDatesObject(newValue)
  }

  useEffect(() => {
    mutate(GET_SALES_OF_USER_DB)

    const dateFromState = datesObject?.startDate as string // will be like '2023-11-05'
    localStorage.setItem('date', dateFromState ?? '')

    mutate(GET_DATE_LS)
  }, [datesObject?.startDate])

  const [isDatePickerBumping, setIsDatePickerBumping] = useState(false)

  useEffect(() => {
    setIsDatePickerBumping(true)

    const timer = setTimeout(() => {
      setIsDatePickerBumping(false)
    }, 400)

    return () => {
      clearTimeout(timer)
    }
  }, [isValidating])

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
    }, 50)
  }

  useEffect(() => {
    document.addEventListener('click', handleClickOnPage)

    return () => {
      document.removeEventListener('click', handleClickOnPage)
    }
  }, [])

  return (
    <>
      <OverlayDarkener
        zIndex={zIndexes.OVERLAY_DATEPICKER_NEW_SALE}
        isActive={isDatePickerOpen}
      />

      <div className={`sticky top-[45px] ${zIndexes.DATEPICKER_NEW_SALE}`}>
        <Datepicker
          startWeekOn="mon"
          readOnly={true}
          containerClassName={'relative text-gray-700'}
          inputClassName={`${
            isDatePickerBumping ? 'bump' : ''
          } w-[90vw] h-[40px] !bg-purple-100 !rounded-lg relative transition-all duration-300 py-2.5 pl-4 pr-14 border-gray-300 dark:bg-slate-800 dark:text-white/80 dark:border-slate-600  tracking-wide font-light  placeholder-gray-400 focus:ring disabled:opacity-40 disabled:cursor-not-allowed focus:border-purple-500 focus:ring-purple-500/20`}
          placeholder="Select the day you did the sale"
          primaryColor={'purple'}
          useRange={false}
          asSingle={true}
          value={datesObject}
          onChange={handleValueChange}
          maxDate={new Date()}
        />
      </div>
    </>
  )
}

DatePickerNewSale.displayName = 'DatePickerNewSale'

export default DatePickerNewSale
