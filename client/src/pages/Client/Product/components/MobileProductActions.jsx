import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Minus, Plus, ShoppingCart, MessageCircle } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "@/components/ui/sheet";
import { convertVND } from "@/utils/ConvertVND.js";
import { CalculateProductWithSale } from "@/utils/Calculate.js";

const MobileProductActions = ({
  product,
  quantity,
  setQuantity,
  onAddToCart,
  isLoading,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleQuantityChange = (value) => {
    // Only allow numbers
    if (value && !/^\d{0,2}$/.test(value)) return;
    setQuantity(value === "" ? "" : Number.parseInt(value) || 1);
  };

  const handleIncrease = () => {
    if (quantity < 20) {
      setQuantity((prev) => Number.parseInt(prev) + 1);
    }
  };

  const handleDecrease = () => {
    if (quantity > 1) {
      setQuantity((prev) => Number.parseInt(prev) - 1);
    }
  };

  const handleAddToCart = () => {
    onAddToCart();
    setIsOpen(false);
  };

  const price = product?.batches[0]?.retailPrice || 0;
  const discountPercentage = product?.discountPercentage || 0;
  const finalPrice = CalculateProductWithSale(price, discountPercentage);

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-3 flex items-center justify-between md:hidden">
      {!product?.isRx ? (
        <>
          <div className="flex-1">
            <p className="text-lg font-bold text-green-600">
              {convertVND(finalPrice)}
            </p>
            {product?.isDiscount && (
              <p className="text-xs text-gray-500 line-through">
                {convertVND(price)}
              </p>
            )}
          </div>

          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button
                className="bg-green-500 hover:bg-green-600"
                disabled={!(product?.quantityStock > 0)}
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                {product?.quantityStock > 0 ? "Thêm vào giỏ hàng" : "Tạm hết hàng"}
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="h-[80vh]">
              <SheetHeader>
                <SheetTitle>Thêm vào giỏ hàng</SheetTitle>
              </SheetHeader>

              <div className="py-4 overflow-auto h-[calc(100%-120px)]">
                <div className="flex gap-4 mb-6">
                  <img
                    src={product?.images[0] || "/placeholder.svg"}
                    alt={product?.name}
                    className="w-24 h-24 object-contain border rounded-md"
                  />
                  <div>
                    <h3 className="font-medium text-sm mb-1">{product?.name}</h3>
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold text-green-600">
                        {convertVND(finalPrice)}
                      </span>
                      {product?.isDiscount && (
                        <span className="text-sm text-gray-500 line-through">
                          {convertVND(price)}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Còn lại: {product?.quantityStock} sản phẩm
                    </p>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <p className="font-medium mb-3">Số lượng</p>
                  <div className="flex items-center">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={handleDecrease}
                      disabled={quantity <= 1}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>

                    <Input
                      type="text"
                      value={quantity}
                      onChange={(e) => handleQuantityChange(e.target.value)}
                      className="w-16 mx-2 text-center"
                      min={1}
                      max={20}
                    />

                    <Button
                      variant="outline"
                      size="icon"
                      onClick={handleIncrease}
                      disabled={quantity >= 20}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="mt-6">
                  <p className="font-medium mb-2">Tổng tiền</p>
                  <p className="text-xl font-bold text-green-600">
                    {convertVND(finalPrice * quantity)}
                  </p>
                </div>
              </div>

              <SheetFooter className="border-t pt-4">
                <Button
                  className="w-full bg-green-500 hover:bg-green-600"
                  onClick={handleAddToCart}
                  disabled={isLoading}
                >
                  {isLoading ? "Đang xử lý..." : "Thêm vào giỏ hàng"}
                </Button>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </>
      ) : (
        <>
          <div className="flex-1">
            <p className="text-sm font-medium text-blue-800">Thuốc kê đơn</p>
            <p className="text-xs text-gray-500">Yêu cầu có đơn từ bác sĩ</p>
          </div>
          
          <a 
            href="https://zalo.me/84866554764"
            target="_blank" 
            rel="noopener noreferrer"
          >
            <Button className="bg-[#0068ff] hover:bg-[#0054cc]">
              <MessageCircle className="h-4 w-4 mr-2" />
              Tư vấn sản phẩm
            </Button>
          </a>
        </>
      )}
    </div>
  );
};

export default MobileProductActions;
