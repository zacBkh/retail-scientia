export default function Home() {
  return (
    <main className=" text-white bg-black flex min-h-screen p-24">Hello</main>
  )
}

import { Inter } from 'next/font/google'

// If loading a variable font, you don't need to specify the font weight
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
})
