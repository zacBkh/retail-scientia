import { FC } from 'react'

import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { Pie } from 'react-chartjs-2'
import type { ChartData, ChartOptions } from 'chart.js'

import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

ChartJS.register(ArcElement, Tooltip, Legend)

interface PieChartProps {
  salesByLine: { category1: string; sales: number }[]
  isLoading: boolean
  isSalesEmpty: boolean
}

const PieChart: FC<PieChartProps> = ({
  salesByLine,
  isLoading,
  isSalesEmpty,
}) => {
  const allLines = salesByLine.map((line) => line.category1)
  const allSales = salesByLine.map((line) => line.sales)

  const data: ChartData<'pie'> = {
    labels: allLines,
    // labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
    datasets: [
      {
        label: 'Sales ($)',
        // data: [12, 19, 3, 5, 2, 3],
        data: allSales,
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(153, 102, 255, 0.2)',
          'rgba(255, 159, 64, 0.2)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
        ],
        borderWidth: 1,
      },
    ],
  }

  const options: ChartOptions<'pie'> = {
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          font: {
            family: 'Arial, sans-serif', // Set the font family here
          },
        },
      },
    },
  }

  return (
    <div className="card-dashboard w-full md:w-1/2 flex justify-center items-center">
      <div className=" md:w-full p-3 flex-1">
        {isLoading ? (
          <>
            <Skeleton
              circle
              containerClassName="flex"
              className="h-[280px] !w-[280px] mx-auto  mb-2"
            />
            <Skeleton
              count={2}
              className=""
              containerClassName="w-1/2 block mx-auto "
            />
          </>
        ) : isSalesEmpty ? (
          <p className="block text-center">Not much to show here! 😭</p>
        ) : (
          <Pie options={options} data={data} />
        )}
      </div>
    </div>
  )
}

export default PieChart
