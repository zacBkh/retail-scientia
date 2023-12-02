import { FC } from 'react'

import { CSVLink } from 'react-csv'

import type { SalesWithProducts } from '@/types'

import dayjs from 'dayjs'

import { FaFileExcel } from 'react-icons/fa6'

interface CSVExportProps {
  sales: SalesWithProducts | undefined
}

const CSVExport: FC<CSVExportProps> = ({ sales }) => {
  console.log('sales', sales)

  const headers = [
    { label: 'Date', key: 'date' },
    { label: 'Product EAN', key: 'ean' },
    { label: 'Product Description', key: 'description' },
    { label: 'Product Size', key: 'size' },
    { label: 'Product Axis', key: 'axis' },
    { label: 'Product Category 1', key: 'category1' },
    { label: 'Product Category 2', key: 'category2' },
    { label: 'Product Regular Price', key: 'regularPrice' },
    { label: 'Product Gender', key: 'gender' },
    { label: 'Product Time Period', key: 'timePeriod' },
    { label: 'Seller Name', key: 'name' },
    { label: 'Seller Country', key: 'country' },
    { label: 'Seller POS', key: 'pointOfSale' },
  ]

  const data =
    sales?.map((sale) => ({
      date: dayjs(sale.date).format('MM/DD/YYYY'),
      ...sale.productSold,
      ...sale.seller,
    })) || []

  return (
    <>
      <CSVLink data={data} headers={headers}>
        <FaFileExcel className={'text-purple-400'} />
      </CSVLink>
    </>
  )
}

export default CSVExport
