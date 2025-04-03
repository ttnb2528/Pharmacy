import Item from "../ProductItem/Item.jsx"
import MobileProductItem from "./MobileProductItem.jsx"

const GridProduct = ({ products, setIsLoading, isMobile }) => {
  if (isMobile) {
    return (
      <div className="grid grid-cols-2 gap-2">
        {products?.map((product) => (
          <MobileProductItem key={product._id} product={product} setIsLoading={setIsLoading} />
        ))}
      </div>
    )
  }

  return (
    <div className="w-3/4 rounded-lg">
      <div className="grid grid-cols-4">
        {products?.map((product) => (
          <Item key={product._id} product={product} setIsLoading={setIsLoading} />
        ))}
      </div>
    </div>
  )
}

export default GridProduct

