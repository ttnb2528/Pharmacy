import Item from "../ProductItem/Item.jsx";
import MobileProductItem from "./MobileProductItem.jsx";

const GridProduct = ({
  products,
  setIsLoading,
  isMobile,
  hasMoreProducts,
  loadMoreProducts,
}) => {
  if (isMobile) {
    return (
      <div className="grid grid-cols-2 gap-2">
        {products?.map((product) => (
          <MobileProductItem
            key={product._id}
            product={product}
            setIsLoading={setIsLoading}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="w-3/4 rounded-lg">
      <div className="grid grid-cols-4">
        {products?.map((product) => (
          <Item
            key={product._id}
            product={product}
            setIsLoading={setIsLoading}
          />
        ))}
      </div>
      {hasMoreProducts && (
        <div className="col-span-4 flex justify-center mt-4">
          <button
            className="px-6 py-2 bg-white border border-[#26773d] text-[#26773d] rounded-lg font-medium"
            onClick={loadMoreProducts}
          >
            Xem thêm
          </button>
        </div>
      )}
    </div>
  );
};

export default GridProduct;
