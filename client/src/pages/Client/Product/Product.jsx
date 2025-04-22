import { useEffect, useState } from "react";
import Breadcrumbs from "./components/Breadcumbs.jsx";
import ListProduct from "./components/ListProduct.jsx";
import { apiClient } from "@/lib/api-client.js";
import { GET_ALL_PRODUCT_BY_CATEGORY_ROUTE, GET_ALL_CATEGORIES_ROUTE } from "@/API/index.api.js";
import { useMediaQuery } from "@/hook/use-media-query.js";
import MobileProductHeader from "./components/MobileProductHeader.jsx";
import { useParams } from "react-router-dom";
import Loading from "@/pages/component/Loading.jsx";
import { toast } from "sonner";
import slugify from "slugify";

const Product = (props) => {
  const { categorySlug } = useParams(); // Lấy categorySlug từ URL
  const [title, setTitle] = useState(props?.title || "");
  const [categoryId, setCategoryId] = useState(props?.categoryId || "");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const isMobile = useMediaQuery("(max-width: 640px)");

  // Lấy thông tin danh mục từ slug nếu không có trong props
  useEffect(() => {
    const getCategoryInfo = async () => {
      // Nếu đã có thông tin từ props, không cần lấy lại
      if (props?.title && props?.categoryId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await apiClient.get(GET_ALL_CATEGORIES_ROUTE);
        
        if (response.status === 200 && response.data.status === 200) {
          const categories = response.data.data;
          const currentCategory = categories.find(
            cat => slugify(cat.name, { lower: true }) === categorySlug
          );
          
          if (currentCategory) {
            setTitle(currentCategory.name);
            setCategoryId(currentCategory._id);
          } else {
            toast.error("Không tìm thấy danh mục");
            setLoading(false);
          }
        }
      } catch (error) {
        console.error("Lỗi khi lấy thông tin danh mục:", error);
        setLoading(false);
      }
    };
    
    getCategoryInfo();
  }, [categorySlug, props?.title, props?.categoryId]);

  // Lấy sản phẩm khi đã có categoryId
  useEffect(() => {
    const fetchProducts = async () => {
      if (!categoryId) return;
      
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
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [categoryId]);

  if (loading) {
    return <Loading />;
  }

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
