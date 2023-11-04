import { getAllProducts } from '@/services/prisma-queries'

import ProductCard from '@components/product-card'
import DateSelector from '@components/date-selector/date-selector'
import Button from '@/components/ui/button-validate-cart'

const HomePage = async () => {
  const allProducts = await getAllProducts()

  return (
    <main className=" flex flex-col items-center gap-y-4 text-black min-h-screen p-2">
      <DateSelector />

      <div className="flex flex-wrap gap-x-1 gap-y-2 justify-between items-center">
        {allProducts.map((product) => (
          <ProductCard
            key={product.id}
            ean={product.ean}
            reference={product.reference}
            description={product.description}
            category1={product.category1}
            category2={product.category2}
            gender={product.gender}
            img={product.img}
            isSet={product.isSet}
            regularPrice={product.regularPrice}
            size={product.size}
            timePeriod={product.timePeriod}
            id={product.id}
          />
        ))}
      </div>
    </main>
  )
}

export default HomePage
