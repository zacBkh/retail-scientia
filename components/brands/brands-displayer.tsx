import { FC } from 'react'

interface BrandsDisplayerProps {
  name: string
  pic?: string
}

const BrandsDisplayer: FC<BrandsDisplayerProps> = ({ name, pic }) => {
  return (
    <>
      <button className="underline p-1">{name}</button>
    </>
  )
}

export default BrandsDisplayer
