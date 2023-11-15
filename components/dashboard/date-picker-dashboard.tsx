'use client'

import { FC } from 'react'
import Datepicker from 'react-tailwindcss-datepicker'

import type { DateValueType } from 'react-tailwindcss-datepicker'

import { SHORTCUT_LABELS } from '@/constants/date-picker'

interface DatePickerDashboardProps {
  datesObject: DateValueType
  onNewDateObject: (newDateObject: DateValueType) => void
}

const DatePickerDashboard: FC<DatePickerDashboardProps> = ({
  datesObject,
  onNewDateObject,
}) => {
  const handleValueChange = (newValue: DateValueType) => {
    if (newValue?.endDate === '3000-01-01') {
      return onNewDateObject({ startDate: null, endDate: null })
    }
    onNewDateObject(newValue)
  }

  const today = new Date()
  let threeMonthsAgo = new Date(today)
  threeMonthsAgo.setMonth(today.getMonth() - 3)

  return (
    <div>
      <Datepicker
        configs={SHORTCUT_LABELS}
        startWeekOn="mon"
        separator={'to'}
        useRange={false}
        readOnly={true}
        value={datesObject}
        inputClassName={
          'w-[87vw] h-[40px] !bg-purple-100 !rounded-lg  relative transition-all duration-300 py-2.5 pl-4 pr-14 w-full border-gray-300 dark:bg-slate-800 dark:text-white/80 dark:border-slate-600  tracking-wide font-light placeholder-gray-400 focus:ring disabled:opacity-40 disabled:cursor-not-allowed focus:border-purple-500 focus:ring-purple-500/20'
        }
        onChange={handleValueChange}
        placeholder="Choose a date range"
        primaryColor={'purple'}
        maxDate={new Date()}
        showShortcuts
      />
    </div>
  )
}

DatePickerDashboard.displayName = 'DateSelector'

export default DatePickerDashboard
