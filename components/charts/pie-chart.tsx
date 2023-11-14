import { FC } from 'react'

import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  ChartOptions,
  ChartData,
} from 'chart.js'
import { Pie } from 'react-chartjs-2'

import { HERMES_LINE_NAME } from '@/constants/business'

ChartJS.register(ArcElement, Tooltip, Legend)

interface PieChartProps {
  salesByLine: { Line: HERMES_LINE_NAME; sales: number }[]
}

const PieChart: FC<PieChartProps> = ({ salesByLine }) => {
  const allLines = salesByLine.map((line) => line.Line)
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

  // const options: ChartOptions<'pie'> = {
  //   font: {
  //     family: 'Arial, sans-serif',
  //     size: 10,
  //     style: 'normal',
  //     weight: 'normal',
  //     lineHeight: 1.2,
  //   },
  //   legend: {

  //   display: true,
  //   labels: {
  //     padding: 20, // Adjust the padding to add space between legend and chart
  //     font: {
  //       size: 16, // Adjust the font size as needed
  //       family: 'Arial, sans-serif', // Specify the font family
  //       weight: 'bold', // Specify the font weight
  //     },
  //   },
  //   },
  //   layout: {
  //     padding: {
  //       left: 20,
  //       right: 20,
  //       top: 20,
  //       bottom: 20,
  //     },
  //   },
  // }
  const options = {
    plugins: {
      legend: {
        labels: {
          font: {
            family: 'Arial, sans-serif', // Set the font family here
          },
        },
      },
    },
  }

  return (
    <div className="w-[300px] mx-auto">
      <Pie options={options} data={data} />
    </div>
  )
}

export default PieChart
