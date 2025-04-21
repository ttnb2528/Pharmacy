import { useEffect, useState } from "react";
import FilterProduct from "./FilterProduct";
import Loading from "@/pages/component/Loading.jsx";
import { useMediaQuery } from "@/hook/use-media-query.js";
import GridProduct from "./GridProduct";
import MobileFilterControls from "./MobileFilterControls.jsx";
import { useTranslation } from "react-i18next";

const ProductList = ({ products }) => {
  const { t } = useTranslation();
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [displayedProducts, setDisplayedProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [sortOrder, setSortOrder] = useState(null);
  const [isFilterApplied, setIsFilterApplied] = useState(false);
  const isMobile = useMediaQuery("(max-width: 640px)");
  const [page, setPage] = useState(1);
  const productsPerPage = isMobile ? 6 : 12;

  useEffect(() => {
    if (products && products.length > 0) {
      // Initialize or update products
      let updatedProducts = [...products];

      // Apply sorting if needed
      if (sortOrder === "price-asc") {
        updatedProducts.sort(
          (a, b) => a.batches[0].retailPrice - b.batches[0].retailPrice
        );
      } else if (sortOrder === "price-desc") {
        updatedProducts.sort(
          (a, b) => b.batches[0].retailPrice - a.batches[0].retailPrice
        );
      }

      // Update filtered and displayed products
      setFilteredProducts(products); // Set to full list on initial load
      setDisplayedProducts(updatedProducts.slice(0, page * productsPerPage));
    }
  }, [products, sortOrder, page, productsPerPage]);

  const handleFilter = (filters) => {
    setIsLoading(true);
    setIsFilterApplied(true); // Mark that a user-applied filter has occurred

    let updatedProducts = products;

    // Apply filters only if they exist
    const { priceRange, selectedBrands, selectedOrigins } = filters;

    // Filter by price range
    if (priceRange) {
      const [minPrice, maxPrice] = priceRange.split("-").map(Number);
      updatedProducts = updatedProducts.filter((product) => {
        const price = product.batches[0].retailPrice;
        return maxPrice
          ? price >= minPrice && price <= maxPrice
          : price >= minPrice;
      });
    }

    // Filter by brands
    if (selectedBrands && selectedBrands.length > 0) {
      updatedProducts = updatedProducts.filter((product) =>
        selectedBrands.includes(product.brandId.name)
      );
    }

    // Filter by origins
    if (selectedOrigins && selectedOrigins.length > 0) {
      updatedProducts = updatedProducts.filter((product) =>
        selectedOrigins.includes(product.batches[0].ManufactureId.country)
      );
    }

    // Apply sorting to filtered products
    if (sortOrder === "price-asc") {
      updatedProducts.sort(
        (a, b) => a.batches[0].retailPrice - b.batches[0].retailPrice
      );
    } else if (sortOrder === "price-desc") {
      updatedProducts.sort(
        (a, b) => b.batches[0].retailPrice - a.batches[0].retailPrice
      );
    }

    setFilteredProducts(updatedProducts);
    setDisplayedProducts(updatedProducts.slice(0, productsPerPage)); // Reset to first page
    setPage(1);
    setIsLoading(false);
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
                    {t("Other.moreProduct")}
                  </button>
                </div>
              )}
            </div>
          ) : (
            isFilterApplied && (
              <div className="mt-4 p-6 bg-white rounded-lg flex items-center justify-center">
                <p className="text-base font-semibold text-gray-500">
                  {t("Other.emptyFilter")}
                </p>
              </div>
            )
          )}
        </>
      ) : (
        <div className="flex gap-8">
          <FilterProduct
            products={products}
            onFilter={handleFilter}
            setIsLoading={setIsLoading}
          />

          {displayedProducts.length > 0 ? (
            <GridProduct
              products={displayedProducts}
              setIsLoading={setIsLoading}
              isMobile={isMobile}
            />
          ) : (
            isFilterApplied && (
              <div className="w-3/4 flex items-center justify-center rounded-lg">
                <p className="text-lg font-semibold text-gray-500">
                  {t("Other.emptyFilter")}
                </p>
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
};

export default ProductList;
