import { FC } from 'react'

import { CSVLink } from 'react-csv'

import type { SalesWithProducts } from '@/types'

import dayjs from 'dayjs'

import { FaFileExcel } from 'react-icons/fa6'

import { toast } from 'react-toastify'

import type { DateValueType } from 'react-tailwindcss-datepicker'

interface CSVExportProps {
  sales: SalesWithProducts | undefined
  userName: String | null | undefined
  dates: DateValueType
}

const CSVExport: FC<CSVExportProps> = ({ sales, userName, dates }) => {
  const isSingleDate = dates?.startDate === dates?.endDate

  let exportedFileName

  if (dates?.startDate === null || dates?.endDate === null) {
    exportedFileName = `${userName} - Total sales`
  } else {
    if (isSingleDate) {
      exportedFileName = `${userName} - Sales of ${dates?.startDate}`
    } else {
      exportedFileName = `${userName} - Sales from ${dates?.startDate} to ${dates?.endDate} `
    }
  }

  const headers = [
    // Product
    { label: 'Date - MM/DD/YYYY', key: 'date' },
    { label: 'Product EAN', key: 'ean' },
    { label: 'Product Description', key: 'description' },
    { label: 'Product Size', key: 'size' },
    { label: 'Product Axis', key: 'axis' },
    { label: 'Product Category 1', key: 'category1' },
    { label: 'Product Category 2', key: 'category2' },
    { label: 'Product Regular Price', key: 'currentPrice' },
    { label: 'Product Gender', key: 'gender' },
    { label: 'Product Time Period', key: 'timePeriod' },
    // Seller
    { label: 'Seller Name', key: 'name' },
    { label: 'Staff ID', key: 'staffID' },
    { label: 'Seller Country', key: 'country' },
    { label: 'Seller POS', key: 'pointOfSale' },
    // Brand
    { label: 'Brand', key: 'brand.name' },
  ]

  const data =
    sales?.map((sale) => ({
      date: dayjs(sale.date).format('MM/DD/YYYY'),
      ...sale.productSold,
      ...sale.seller,
    })) || []

  const handleDonwloadRequest = () => {
    if (!sales?.length) {
      toast.error(
        <div>
          There are no sales to download. <br /> Change the date or date range.
        </div>,
        { toastId: 'CSV' }
      )
      return false
    } else {
      toast.success('Report downloaded', { toastId: 'CSV' })
    }
  }

  return (
    <>
      <CSVLink
        onClick={handleDonwloadRequest}
        data={data}
        headers={headers}
        filename={exportedFileName}
      >
        <FaFileExcel
          className={`text-purple-400 ${!sales?.length ? 'opacity-60' : ''}`}
        />
      </CSVLink>
    </>
  )
}

export default CSVExport
