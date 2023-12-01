import { FC } from 'react'

import { CSVLink } from 'react-csv'

import type { SalesWithProducts } from '@/types'

import dayjs from 'dayjs'

import { FaFileExcel } from 'react-icons/fa6'

interface CSVExportProps {
  sales: SalesWithProducts | undefined
}

const CSVExport: FC<CSVExportProps> = ({ sales }) => {
  const isoDateString = '2023-12-01T00:00:00.000Z'

  const parsedDate = dayjs(isoDateString).format('DD/MM/YYYY')
  console.log('parsedDate', parsedDate)

  const headers = [
    { label: 'Sale ID', key: 'id' },
    { label: 'Date', key: 'date' },
    { label: 'Product ID', key: 'productId' },
    { label: 'Seller ID', key: 'sellerId' },
    { label: 'Product EAN', key: 'ean' },
    { label: 'Product Description', key: 'description' },
    { label: 'Product Size', key: 'size' },
    { label: 'Product Axis', key: 'axis' },
    { label: 'Product Category 1', key: 'category1' },
    { label: 'Product Category 2', key: 'category2' },
    { label: 'Product Regular Price', key: 'regularPrice' },
    { label: 'Product Gender', key: 'gender' },
    { label: 'Product Time Period', key: 'timePeriod' },
    { label: 'Product Brand ID', key: 'brandId' },
  ]

  const data =
    sales?.map((sale) => ({
      idSale: sale.id,
      date: dayjs(sale.date).format('MM/DD/YYYY'),
      productId: sale.productId,
      sellerId: sale.sellerId,
      productSoldId: sale.productSold.id,
      ...sale.productSold,
    })) || []

  console.log('data', data)

  //   const data = [
  //     { firstname: 'Ahmed', lastname: 'Tomi', email: 'ah@smthing.co.com' },
  //     { firstname: 'Raed', lastname: 'Labes', email: 'rl@smthing.co.com' },
  //     { firstname: 'Yezzi', lastname: 'Min l3b', email: 'ymin@cocococo.com' },
  //   ]

  return (
    <>
      <CSVLink data={data} headers={headers}>
        <FaFileExcel className={'text-purple-400'} />
      </CSVLink>
    </>
  )
}

export default CSVExport

// {
//     "id": 130,
//     "createdAt": "2023-12-01T19:44:18.117Z",
//     "updatedAt": "2023-12-01T19:44:18.117Z",
//     "date": "2023-12-01T00:00:00.000Z",
//     "productId": 120,
//     "sellerId": 4,
//     "productSold": {
//         "id": 120,
//         "reference": "108409V0",
//         "ean": "3346130413639",
//         "description": "H24 Refreshing Deodorant Spray 150ml",
//         "size": "150ml",
//         "img": "",
//         "axis": "Perfume",
//         "category1": "H24",
//         "category2": "H24 Dérivés",
//         "regularPrice": 42,
//         "gender": "MEN",
//         "timePeriod": "2024-01",
//         "brandId": 1
//     }
// }
