import { useEffect, useState } from "react";
import Breadcrumbs from "./components/Breadcumbs.jsx";
import ListProduct from "./components/ListProduct.jsx";
import { apiClient } from "@/lib/api-client.js";
import { GET_ALL_PRODUCT_BY_CATEGORY_ROUTE } from "@/API/index.api.js";
import { useMediaQuery } from "@/hook/use-media-query.js";
import MobileProductHeader from "./components/MobileProductHeader.jsx";

const Product = (props) => {
  const { title, categoryId } = props;
  const [products, setProducts] = useState([]);
  const isMobile = useMediaQuery("(max-width: 640px)");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await apiClient.get(
          `${GET_ALL_PRODUCT_BY_CATEGORY_ROUTE}/${categoryId}`
        );

        if (response.status === 200 && response.data.status === 200) {
          setProducts(response.data.data);
        } else {
          setProducts([]);
        }
      } catch (error) {
        console.error("Lỗi khi lấy sản phẩm:", error);
      }
    };

    fetchProducts();
  }, [categoryId]);

  return (
    <div>
      {isMobile ? (
        <MobileProductHeader title={title} />
      ) : (
        <Breadcrumbs category={title} />
      )}
      <ListProduct products={products} />
    </div>
  );
};

export default Product;
