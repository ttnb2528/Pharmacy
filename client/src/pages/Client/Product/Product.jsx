import { useEffect, useState } from "react";
import Breadcrumbs from "./components/Breadcumbs.jsx";
import ListProduct from "./components/ListProduct.jsx";
import { apiClient } from "@/lib/api-client.js";
import { GET_ALL_PRODUCT_BY_CATEGORY_ROUTE } from "@/API/index.api.js";

const Product = (props) => {
  const { title, categoryId } = props;
  const [products, setProducts] = useState([]);
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
      <Breadcrumbs category={title} />
      <ListProduct products={products} />
    </div>
  );
};

export default Product;
