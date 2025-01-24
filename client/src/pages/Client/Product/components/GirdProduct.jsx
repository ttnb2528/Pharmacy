import Item from "../ProductItem/Item.jsx";

const GirdProduct = ({ products, setIsLoading }) => {
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
    </div>
  );
};

export default GirdProduct;
