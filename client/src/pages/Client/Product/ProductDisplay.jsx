import { Separator } from "@/components/ui/separator.jsx";
import Breadcrumbs from "./components/Breadcumbs.jsx";
import SwiperProduct from "./components/SwiperProduct.jsx";
import ProductDetailInfo from "./components/ProductDetailInfo.jsx";
import ProductDescription from "./components/ProductDescription.jsx";
import ProductDetailRight from "./components/ProductDetailRight.jsx";
import { useLocation } from "react-router-dom";
import ProductComments from "./components/ProductComments.jsx";
import { useMediaQuery } from "@/hook/use-media-query.js";
import { useContext, useState } from "react";
import { PharmacyContext } from "@/context/Pharmacy.context.jsx";
import { HomeContext } from "@/context/HomeContext.context.jsx";
import { useAppStore } from "@/store/index.js";
import { apiClient } from "@/lib/api-client.js";
import { ADD_TO_CART_ROUTE } from "@/API/index.api.js";
import { toast } from "sonner";
import MobileProductHeader from "./components/MobileProductHeader.jsx";
import MobileProductSwiper from "./components/MobileProductSwiper.jsx";
import MobileProductDescription from "./components/MobileProductDescription.jsx";
import MobileProductActions from "./components/MobileProductActions.jsx";

const ProductDisplay = () => {
  const { state } = useLocation();
  const product = state.product;
  const isMobile = useMediaQuery("(max-width: 640px)");
  const [quantity, setQuantity] = useState(1);
  const { setCart } = useContext(PharmacyContext);
  const { setShowLogin } = useContext(HomeContext);
  const { userInfo } = useAppStore();
  const [isLoading, setIsLoading] = useState(false);

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
            [product.id]: prev[product.id] + Number(quantity),
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
