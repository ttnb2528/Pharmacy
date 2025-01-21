import FilterProduct from "./FilterProduct.jsx";
import GirdProduct from "./GirdProduct.jsx";

const ListProduct = ({ products }) => {
  return (
    <div className="flex gap-8 mb-10">
      <FilterProduct />
      <GirdProduct products={products} />
    </div>
  );
};

export default ListProduct;
