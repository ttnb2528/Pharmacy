import { useSearchParams } from "react-router-dom";
import Breadcrumbs from "./components/Breadcumbs.jsx";
import ListProduct from "./components/ListProduct.jsx";
import { useContext, useEffect, useState } from "react";
import { PharmacyContext } from "@/context/Pharmacy.context.jsx";

const SearchResult = () => {
  const [searchParams] = useSearchParams();
  const keyword = searchParams.get("keyword");
  const { allProducts } = useContext(PharmacyContext);
  const [searchResult, setSearchResult] = useState([]);

  useEffect(() => {
    if (keyword) {
      const filteredProducts = allProducts.filter((product) => {
        return product.name.toLowerCase().includes(keyword.toLowerCase());
      });

      setSearchResult(filteredProducts);
    }
  }, [allProducts, keyword]);

  return (
    <div>
      <Breadcrumbs category={"search"} />
      <ListProduct products={searchResult} />
    </div>
  );
};

export default SearchResult;
