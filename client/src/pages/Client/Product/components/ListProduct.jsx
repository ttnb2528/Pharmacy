import FilterProduct from "./FilterProduct.jsx";
import GirdProduct from "./GirdProduct.jsx";

const ListProduct = () => {
  return (
    <div className="flex gap-8 mb-10">
      <FilterProduct />
      <GirdProduct />
    </div>
  );
};

export default ListProduct;
