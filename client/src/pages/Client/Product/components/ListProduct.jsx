import { useEffect, useState } from "react";
import FilterProduct from "./FilterProduct";
import Loading from "@/pages/component/Loading.jsx";
import { useMediaQuery } from "@/hook/use-media-query.js";
import GridProduct from "./GridProduct";
import MobileFilterControls from "./MobileFilterControls.jsx";

const ProductList = ({ products }) => {
  const [filteredProducts, setFilteredProducts] = useState(products);
  const [displayedProducts, setDisplayedProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [sortOrder, setSortOrder] = useState(null);
  const isMobile = useMediaQuery("(max-width: 640px)");
  const [page, setPage] = useState(1);
  const productsPerPage = isMobile ? 6 : 12;

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setFilteredProducts(products);
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [products]);

  useEffect(() => {
    // Apply sorting if needed
    const sortedProducts = [...filteredProducts];

    if (sortOrder === "price-asc") {
      sortedProducts.sort(
        (a, b) => a.batches[0].retailPrice - b.batches[0].retailPrice
      );
    } else if (sortOrder === "price-desc") {
      sortedProducts.sort(
        (a, b) => b.batches[0].retailPrice - a.batches[0].retailPrice
      );
    }

    // Set displayed products based on pagination
    setDisplayedProducts(sortedProducts.slice(0, page * productsPerPage));
  }, [filteredProducts, sortOrder, page, productsPerPage]);

  const handleFilter = (filters) => {
    const { priceRange, selectedBrands, selectedOrigins } = filters;

    let updatedProducts = products;

    // Lọc theo khoảng giá
    if (priceRange) {
      const [minPrice, maxPrice] = priceRange.split("-").map(Number);
      updatedProducts = updatedProducts.filter((product) => {
        const price = product.batches[0].retailPrice;
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
    setPage(1); // Reset pagination when filter changes
  };

  const handleSort = (order) => {
    setSortOrder(order);
  };

  const loadMoreProducts = () => {
    setPage((prev) => prev + 1);
  };

  const hasMoreProducts = displayedProducts.length < filteredProducts.length;

  return (
    <div className="mb-10">
      {isLoading && <Loading />}

      {isMobile ? (
        <>
          <MobileFilterControls
            products={products}
            onFilter={handleFilter}
            onSort={handleSort}
            setIsLoading={setIsLoading}
          />

          {displayedProducts.length > 0 ? (
            <div className="mt-3">
              <GridProduct
                products={displayedProducts}
                setIsLoading={setIsLoading}
                isMobile={isMobile}
              />

              {hasMoreProducts && (
                <div className="flex justify-center mt-6">
                  <button
                    className="px-6 py-2 bg-white border border-[#26773d] text-[#26773d] rounded-lg font-medium"
                    onClick={loadMoreProducts}
                  >
                    Xem thêm sản phẩm
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="mt-4 p-6 bg-white rounded-lg flex items-center justify-center">
              <p className="text-base font-semibold text-gray-500">
                Ôi không! Có lẽ không có sản phẩm nào phù hợp với yêu cầu của
                bạn
              </p>
            </div>
          )}
        </>
      ) : (
        <div className="flex gap-8">
          <FilterProduct
            products={products}
            onFilter={handleFilter}
            setIsLoading={setIsLoading}
          />

          {filteredProducts.length > 0 ? (
            <GridProduct
              products={filteredProducts}
              setIsLoading={setIsLoading}
              isMobile={isMobile}
            />
          ) : (
            <div className="w-3/4 flex items-center justify-center rounded-lg">
              <p className="text-lg font-semibold text-gray-500">
                Ôi không! Có lẽ không có sản phẩm nào phù hợp với yêu cầu của
                bạn
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProductList;
