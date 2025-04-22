import { Separator } from "@/components/ui/separator.jsx";
import Breadcrumbs from "./components/Breadcumbs.jsx";
import SwiperProduct from "./components/SwiperProduct.jsx";
import ProductDetailInfo from "./components/ProductDetailInfo.jsx";
import ProductDescription from "./components/ProductDescription.jsx";
import ProductDetailRight from "./components/ProductDetailRight.jsx";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import ProductComments from "./components/ProductComments.jsx";
import { useMediaQuery } from "@/hook/use-media-query.js";
import { useContext, useState, useEffect } from "react";
import { PharmacyContext } from "@/context/Pharmacy.context.jsx";
import { HomeContext } from "@/context/HomeContext.context.jsx";
import { useAppStore } from "@/store/index.js";
import { apiClient } from "@/lib/api-client.js";
import { ADD_TO_CART_ROUTE, GET_PRODUCT_BY_SLUG_ROUTE, GET_PRODUCT_ROUTE } from "@/API/index.api.js";
import { toast } from "sonner";
import MobileProductHeader from "./components/MobileProductHeader.jsx";
import MobileProductSwiper from "./components/MobileProductSwiper.jsx";
import MobileProductDescription from "./components/MobileProductDescription.jsx";
import MobileProductActions from "./components/MobileProductActions.jsx";
import Loading from "@/pages/component/Loading.jsx";
import slugify from "slugify";

const ProductDisplay = () => {
  const { state } = useLocation();
  const { categorySlug, productSlug } = useParams();
  const navigate = useNavigate();
  
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [apiError, setApiError] = useState(null);
  
  const isMobile = useMediaQuery("(max-width: 640px)");
  const [quantity, setQuantity] = useState(1);
  const { setCart } = useContext(PharmacyContext);
  const { setShowLogin } = useContext(HomeContext);
  const { userInfo } = useAppStore();

  // Fetch product data regardless of state
  useEffect(() => {
    const fetchProductData = async () => {
      console.log("fetchProductData được gọi với:", { categorySlug, productSlug, hasState: !!state?.product });
      
      // Nếu có state, sử dụng data từ state trước
      if (state?.product) {
        console.log("Sử dụng dữ liệu từ state:", state.product.name);
        setProduct(state.product);
        updateViewedProducts(state.product);
        setIsLoading(false);
        return;
      }
      
      // Nếu không có state hoặc không có product trong state, fetch từ API
      if (categorySlug && productSlug) {
        try {
          setIsLoading(true);
          console.log(`Đang tải sản phẩm với slug: ${categorySlug}/${productSlug}`);
          console.log("API endpoint:", GET_PRODUCT_BY_SLUG_ROUTE);
          
          const response = await apiClient.get(GET_PRODUCT_BY_SLUG_ROUTE, {
            params: { 
              categorySlug, 
              productSlug 
            }
          });

          console.log('API response full:', response);
          
          if (response.status === 200 && response.data.status === 200 && response.data.data) {
            console.log("Dữ liệu sản phẩm nhận được:", response.data.data.name);
            setProduct(response.data.data);
            updateViewedProducts(response.data.data);
          } else {
            console.error("Không tìm thấy sản phẩm:", response.data);
            setApiError("Không tìm thấy thông tin sản phẩm");
            toast.error("Không tìm thấy thông tin sản phẩm");
            // Không navigate ngay để xem lỗi
          }
        } catch (error) {
          console.error("Lỗi khi lấy thông tin sản phẩm:", error);
          setApiError(error.message || "Có lỗi xảy ra khi tải thông tin sản phẩm");
          toast.error("Có lỗi xảy ra khi tải thông tin sản phẩm");
          // Không navigate ngay để xem lỗi
        } finally {
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
        console.error("Thiếu thông tin slug để tìm sản phẩm");
        setApiError("URL sản phẩm không chính xác");
      }
    };

    fetchProductData();
  }, [categorySlug, productSlug, navigate, state]);

  const updateViewedProducts = (productData) => {
    if (!productData) return;
    
    try {
      const storedProducts = JSON.parse(localStorage.getItem("viewedProducts")) || [];
      let updatedProducts = storedProducts.filter((p) => p.id !== productData.id);
      updatedProducts = [...updatedProducts, productData];
      
      if (updatedProducts.length > 10) {
        updatedProducts = updatedProducts.slice(1);
      }
      
      localStorage.setItem("viewedProducts", JSON.stringify(updatedProducts));
      window.dispatchEvent(new CustomEvent("viewedProductsUpdated"));
    } catch (error) {
      console.error("Lỗi khi cập nhật sản phẩm đã xem:", error);
    }
  };

  const handleAddToCart = async () => {
    if (!userInfo) {
      setShowLogin(true);
      return;
    }

    try {
      setIsLoading(true);
      if (quantity > 20) {
        toast.error("Số lượng sản phẩm tối đa là 20");
        setIsLoading(false);
        return;
      }

      const res = await apiClient.post(ADD_TO_CART_ROUTE, {
        productId: product.id,
        quantity: Number(quantity),
      });

      if (res.status === 200 && res.data.status === 200) {
        setCart((prev) => {
          return {
            ...prev,
            [product.id]: (prev[product.id] || 0) + Number(quantity),
          };
        });

        toast.success("Thêm vào giỏ hàng thành công");
      }
    } catch (error) {
      console.error(error);
      toast.error("Có lỗi xảy ra khi thêm vào giỏ hàng");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  if (!product) {
    return (
      <div className="container mx-auto py-20 text-center">
        <h2 className="text-2xl font-bold mb-4">Không tìm thấy sản phẩm</h2>
        <p className="mb-6">Sản phẩm bạn tìm kiếm không tồn tại hoặc đã bị xóa.</p>
        {apiError && (
          <p className="mb-4 text-red-500">Chi tiết lỗi: {apiError}</p>
        )}
        <button 
          onClick={() => navigate("/")}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Quay về trang chủ
        </button>
      </div>
    );
  }

  return (
    <>
      {isMobile && <MobileProductHeader />}

      <div>
        {!isMobile && (
          <Breadcrumbs
            category={product?.categoryId?.name}
            product={product?.name}
          />
        )}

        <div
          className={`relative ${
            isMobile ? "pb-20" : ""
          } grid grid-cols-1 gap-6 md:container md:grid-cols-[min(60%,calc(555rem/16)),1fr] md:pt-6 lg:grid-cols-[min(72%,calc(970rem/16)),1fr] mb-10 bg-white p-5`}
        >
          <div className="grid md:gap-3">
            <div className="grid grid-cols-1 items-start md:gap-6 lg:grid-cols-2 xl:grid-cols-2">
              {/* Image gallery */}
              <div className="md:sticky md:top-0">
                {isMobile ? (
                  <MobileProductSwiper productImage={product?.images} />
                ) : (
                  <SwiperProduct productImage={product?.images} />
                )}
              </div>

              {/* Product info */}
              <ProductDetailInfo product={product} />
            </div>

            <Separator />

            {/* Product description */}
            {isMobile ? (
              <MobileProductDescription product={product} />
            ) : (
              <ProductDescription product={product} />
            )}

            {/* Thêm phần bình luận */}
            <Separator />
            <ProductComments productId={product?._id} />
          </div>

          {/* Right sidebar - only on desktop */}
          {!isMobile && <ProductDetailRight product={product} />}
        </div>

        {/* Mobile fixed bottom actions */}
        {isMobile && (
          <MobileProductActions
            product={product}
            quantity={quantity}
            setQuantity={setQuantity}
            onAddToCart={handleAddToCart}
            isLoading={isLoading}
          />
        )}
      </div>
    </>
  );
};

export default ProductDisplay;
