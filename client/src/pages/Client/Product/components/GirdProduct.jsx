import Item from "../ProductItem/Item.jsx";

const GirdProduct = () => {
  const products = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];
  return (
    <div className="w-3/4 rounded-lg">
      <div className="grid grid-cols-4">
        {products.map((product) => (
          <Item key={product} />
        ))}
      </div>
    </div>
  );
};

export default GirdProduct;
