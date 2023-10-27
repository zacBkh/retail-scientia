import { getAllProducts } from '@/services/prisma-queries'

import ProductCard from '@/components/product-card'

const HomePage = async () => {
  const allProducts = await getAllProducts()

  return (
    <main className="flex flex-wrap gap-x-1 gap-y-2 justify-between items-center text-black min-h-screen p-2">
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
    </main>
  )
}

export default HomePage
