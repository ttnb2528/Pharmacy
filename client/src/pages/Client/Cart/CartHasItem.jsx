import { useContext, useState } from "react";
import CartItemBox from "./components/CartItemBox.jsx";
import CartItemBoxBuy from "./components/CartItemBoxBuy.jsx";
import { PharmacyContext } from "@/context/Pharmacy.context.jsx";
import { useMediaQuery } from "@/hook/use-media-query.js";
import { apiClient } from "@/lib/api-client.js";
import { CLEAR_CART_ROUTE } from "@/API/index.api.js";
import { toast } from "sonner";
import Loading from "@/pages/component/Loading.jsx";
import MobileCartHeader from "./components/MobileCartHeader.jsx";
import MobileCartSummary from "./components/MobileCartSummary.jsx";

const CartHasItem = () => {
  const isMobile = useMediaQuery("(max-width: 640px)");
  const [isLoading, setIsLoading] = useState(false);
  const { setCart } = useContext(PharmacyContext);
  

  const handleRemoveAllProducts = async () => {
    try {
      setIsLoading(true);
      const res = await apiClient.post(CLEAR_CART_ROUTE);

      if (res.status === 200 && res.data.status === 200) {
        setCart((prev) => {
          const newCart = { ...prev };
          Object.keys(newCart).forEach((key) => {
            newCart[key] = 0;
          });
          return newCart;
        });
        toast.success(res.data.message);
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Đã xảy ra lỗi khi xóa giỏ hàng");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div>
      {isLoading && <Loading />}

      {isMobile && <MobileCartHeader onClearCart={handleRemoveAllProducts} />}

      <div
        className={`relative grid items-start gap-4 md:container md:grid-cols-1 md:pb-4 md:pt-6 lg:grid-cols-[min(80%,calc(1024rem/16)),1fr] ${
          isMobile ? "pb-32 mt-2" : ""
        }`}
      >
        <CartItemBox />
        <CartItemBoxBuy />
      </div>

      {isMobile && <MobileCartSummary />}
    </div>
  );
};

export default CartHasItem;
