import { useEffect, useState } from "react";
import FilterProduct from "./FilterProduct";
import GirdProduct from "./GirdProduct";
import Loading from "@/pages/component/Loading.jsx";

const ProductList = ({ products }) => {
  const [filteredProducts, setFilteredProducts] = useState(products);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setFilteredProducts(products);
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [products]);

  const handleFilter = (filters) => {
    const { priceRange, selectedBrands, selectedOrigins } = filters;

    let updatedProducts = products;

    // Lọc theo khoảng giá
    if (priceRange) {
      const [minPrice, maxPrice] = priceRange.split("-").map(Number);
      updatedProducts = updatedProducts.filter((product) => {
        const price = product.batches[0].price;
        return maxPrice
          ? price >= minPrice && price <= maxPrice
          : price >= minPrice;
      });
    }

    // Lọc theo thương hiệu
    if (selectedBrands && selectedBrands.length > 0) {
      updatedProducts = updatedProducts.filter((product) =>
        selectedBrands.includes(product.brandId.name)
      );
    }

    // Lọc theo xuất xứ
    if (selectedOrigins && selectedOrigins.length > 0) {
      updatedProducts = updatedProducts.filter((product) =>
        selectedOrigins.includes(product.batches[0].ManufactureId.country)
      );
    }

    setFilteredProducts(updatedProducts);
  };

  return (
    <div className="flex gap-8 mb-10">
      {isLoading && <Loading />}
      <FilterProduct
        products={products}
        onFilter={handleFilter}
        setIsLoading={setIsLoading}
      />

      {filteredProducts.length > 0 ? (
        <GirdProduct products={filteredProducts} setIsLoading={setIsLoading} />
      ) : (
        <div className="w-3/4 flex items-center justify-center rounded-lg">
          <p className="text-lg font-semibold text-gray-500">
            Ôi không! Có lẽ không có sản phẩm nào phù hợp với yêu cầu của bạn
          </p>
        </div>
      )}
    </div>
  );
};

export default ProductList;
