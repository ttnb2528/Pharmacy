import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { PharmacyContext } from "@/context/Pharmacy.context.jsx";
import { useAppStore } from "@/store/index.js";
import { CalculateProductWithSale } from "@/utils/Calculate.js";
import { convertVND } from "@/utils/ConvertVND.js";
import slugify from "slugify";
import { toast } from "sonner";
import { apiClient } from "@/lib/api-client.js";
import { ADD_TO_CART_ROUTE } from "@/API/index.api.js";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Minus, Plus } from "lucide-react";
import { useTranslation } from "react-i18next";

const MobileProductItem = ({ product, setIsLoading }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { setCart } = useContext(PharmacyContext);
  const { userInfo } = useAppStore();
  const [isOpen, setIsOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const categorySlug = slugify(
    product?.categoryId?.name || "unknown-category",
    {
      lower: true,
    }
  );

  const productSlug = slugify(product?.name || "unknown-name", { lower: true });
  const path = `/${categorySlug}/${productSlug}`;

  const handleProductClick = () => {
    navigate(path, {
      state: { product },
    });

    const storedProducts =
      JSON.parse(localStorage.getItem("viewedProducts")) || [];

    // Lọc bỏ sản phẩm cũ nếu đã tồn tại
    let updatedProducts = storedProducts.filter((p) => p.id !== product.id);

    // Thêm sản phẩm mới vào cuối danh sách
    updatedProducts = [...updatedProducts, product];

    // Nếu vượt quá 10 sản phẩm, loại bỏ sản phẩm đầu tiên
    if (updatedProducts.length > 10) {
      updatedProducts = updatedProducts.slice(1);
    }

    // Cập nhật localStorage và dispatch một custom event
    localStorage.setItem("viewedProducts", JSON.stringify(updatedProducts));
    window.dispatchEvent(new CustomEvent("viewedProductsUpdated"));
  };

  const AddToCart = async () => {
    if (!userInfo) {
      setIsOpen(false);
      // Assuming setShowLogin is available through context or props
      // setShowLogin(true);
      toast.error("Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng");
      return;
    }

    try {
      setIsLoading(true);
      const res = await apiClient.post(ADD_TO_CART_ROUTE, {
        productId: product.id,
        quantity: quantity,
      });

      if (res.status === 200 && res.data.status === 200) {
        setCart((prev) => {
          return {
            ...prev,
            [product.id]: (prev[product.id] || 0) + quantity,
          };
        });
        toast.success(res.data.message);
        setIsOpen(false);
      }
    } catch (error) {
      console.error(error);
      toast.error("Có lỗi xảy ra khi thêm sản phẩm vào giỏ hàng");
    } finally {
      setIsLoading(false);
    }
  };

  const incrementQuantity = () => {
    if (quantity < product.quantityStock) {
      setQuantity((prev) => prev + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const handleQuantityChange = (e) => {
    const value = Number.parseInt(e.target.value);
    if (!isNaN(value) && value >= 1 && value <= product.quantityStock) {
      setQuantity(value);
    }
  };

  return (
    <div className="bg-white rounded-lg overflow-hidden border border-gray-200 flex flex-col h-full">
      <div className="relative" onClick={handleProductClick}>
        <img
          src={product?.images[0] || "/placeholder.svg"}
          alt={product?.name}
          className="w-full aspect-square object-contain p-2"
        />
        {product.isDiscount && (
          <span className="absolute top-2 left-2 bg-red-400 py-1 px-2 text-xs font-bold text-white rounded-xl">
            {product.discountPercentage}%
          </span>
        )}
      </div>

      <div className="p-2 flex-grow flex flex-col justify-between">
        <h3
          className="text-xs font-medium line-clamp-2 mb-1 min-h-[32px]"
          onClick={handleProductClick}
        >
          {product?.name}
        </h3>

        {product?.batches.length > 0 && product?.quantityStock > 0 ? (
          <div className="mt-auto">
            {product?.isDiscount ? (
              <>
                <del className="block text-xs text-gray-500">
                  {convertVND(product?.batches[0]?.retailPrice)}
                </del>
                <span className="block text-sm font-bold text-green-600">
                  {convertVND(
                    CalculateProductWithSale(
                      product?.batches[0]?.retailPrice,
                      product?.discountPercentage
                    )
                  )}
                </span>
              </>
            ) : (
              <span className="block text-sm font-bold text-green-600">
                {convertVND(product?.batches[0]?.retailPrice)}
              </span>
            )}
          </div>
        ) : (
          <span className="block text-sm font-bold text-red-600 mt-auto">
            {t("Item.tempEmptyStock")}
          </span>
        )}

        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button
              className="w-full mt-2 bg-[#26773d] hover:bg-[#1e5f31] text-xs py-1"
              disabled={
                !(product?.batches.length > 0 && product?.quantityStock > 0)
              }
            >
              {t("Item.selectProduct")}
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="h-[80vh]">
            <SheetHeader>
              <SheetTitle className="text-left">
                {t("Item.productInfo")}
              </SheetTitle>
            </SheetHeader>

            <div className="py-4 overflow-auto h-[calc(100%-120px)]">
              <div className="flex gap-4 mb-4">
                <img
                  src={product?.images[0] || "/placeholder.svg"}
                  alt={product?.name}
                  className="w-24 h-24 object-contain border rounded-md"
                />
                <div>
                  <h3 className="font-medium text-sm mb-1">{product?.name}</h3>
                  {product?.isDiscount ? (
                    <>
                      <del className="block text-xs text-gray-500">
                        {convertVND(product?.batches[0]?.retailPrice)}
                      </del>
                      <span className="block text-base font-bold text-green-600">
                        {convertVND(
                          CalculateProductWithSale(
                            product?.batches[0]?.retailPrice,
                            product?.discountPercentage
                          )
                        )}
                      </span>
                    </>
                  ) : (
                    <span className="block text-base font-bold text-green-600">
                      {convertVND(product?.batches[0]?.retailPrice)}
                    </span>
                  )}
                  <p className="text-xs text-gray-500 mt-1">
                    {t("Item.inStock")}
                  </p>
                </div>
              </div>

              <div className="border-t pt-4">
                <p className="font-medium mb-2">{t("Item.quantity")}</p>
                <div className="flex items-center">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={decrementQuantity}
                    disabled={quantity <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>

                  <Input
                    type="number"
                    value={quantity}
                    onChange={handleQuantityChange}
                    className="w-16 mx-2 text-center"
                    min={1}
                    max={product?.quantityStock}
                  />

                  <Button
                    variant="outline"
                    size="icon"
                    onClick={incrementQuantity}
                    disabled={quantity >= product?.quantityStock}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="mt-4">
                <p className="font-medium mb-2">{t("Item.total")}</p>
                <p className="text-lg font-bold text-green-600">
                  {product?.isDiscount
                    ? convertVND(
                        CalculateProductWithSale(
                          product?.batches[0]?.retailPrice,
                          product?.discountPercentage
                        ) * quantity
                      )
                    : convertVND(product?.batches[0]?.retailPrice * quantity)}
                </p>
              </div>
            </div>

            <SheetFooter className="border-t pt-4">
              <Button
                className="w-full bg-[#26773d] hover:bg-[#1e5f31]"
                onClick={AddToCart}
              >
                {t("Item.add_to_cart")}
              </Button>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
};

export default MobileProductItem;
