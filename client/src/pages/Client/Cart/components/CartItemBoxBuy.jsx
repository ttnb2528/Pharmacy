import { LuTicketPercent, LuX } from "react-icons/lu";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator.jsx";
import { useNavigate } from "react-router-dom";

const CartItemBoxBuy = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedPromo, setSelectedPromo] = useState(null);

  const promotionCodes = [
    { code: "SUMMER10", description: "Giảm 10% cho đơn hàng mùa hè" },
    {
      code: "FREESHIP",
      description: "Miễn phí vận chuyển cho đơn hàng trên 500k",
    },
    { code: "NEWUSER", description: "Giảm 50k cho khách hàng mới" },
  ];

  const handleApplyPromo = (code) => {
    setSelectedPromo(code);
    setIsOpen(false);
  };

  const handleRemovePromo = () => {
    setSelectedPromo(null);
  };
  return (
    <div
      className="sticky top-[calc(var(--header-position-start-sticky)+12px)] hidden gap-4 md:grid"
      style={{ "--header-position-start-sticky": "0px" }}
    >
      <div>
        <div className="flex flex-col space-y-3 rounded-sm bg-white px-4 md:p-3">
          <div className="grid w-full grid-flow-col items-center justify-between">
            <div className="grid grid-cols-[24px_1fr] items-center justify-start gap-1">
              <LuTicketPercent className="w-6 h-6 text-green-500" />
              <p className="text-sm font-semibold">Khuyến mãi</p>
            </div>
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button className="p-0 bg-transparent shadow-none text-green-500 hover:bg-transparent">
                  {selectedPromo ? "Đổi mã" : "Chọn Mã"}
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Mã Khuyến Mãi</SheetTitle>
                  <SheetDescription>
                    Chọn mã khuyến mãi để áp dụng cho đơn hàng của bạn.
                  </SheetDescription>
                </SheetHeader>
                <div className="mt-4 space-y-4">
                  {promotionCodes.map((promo, index) => (
                    <div key={index} className="rounded-lg border p-3">
                      <h3 className="font-semibold">{promo.code}</h3>
                      <p className="text-sm text-gray-500">
                        {promo.description}
                      </p>
                      <Button
                        className="mt-2 bg-green-500 hover:bg-green-600"
                        size="sm"
                        onClick={() => handleApplyPromo(promo.code)}
                      >
                        Áp dụng
                      </Button>
                    </div>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
          </div>
          {selectedPromo && (
            <div className="flex items-center justify-between bg-green-100 p-2 rounded-md">
              <span className="text-sm text-green-700">{selectedPromo}</span>
              <Button
                size="sm"
                variant="ghost"
                className="p-1 h-auto"
                onClick={handleRemovePromo}
              >
                <LuX className="w-4 h-4 text-green-700" />
              </Button>
            </div>
          )}
        </div>
      </div>
      <div>
        <div className="grid grid-flow-col items-center gap-2 rounded-sm bg-white md:grid-flow-row md:items-start md:gap-4 md:p-4">
          <div className="grid gap-4">
            <div className="hidden grid-flow-col items-center justify-between gap-2 md:grid">
              <p className="text-sm text-neutral-900">Tạm tính</p>
              <p className="text-sm font-semibold text-neutral-900">
                336.000&nbsp;₫
              </p>
            </div>
            <div className="hidden grid-flow-col  items-center justify-between gap-2 md:grid">
              <p className="text-sm text-neutral-900">Giảm giá ưu đãi</p>
              <p className="text-sm font-semibold text-neutral-900">-</p>
            </div>
            <div className="hidden grid-flow-col  items-center justify-between gap-2 md:grid">
              <p className="text-sm text-neutral-900">Giảm giá sản phẩm</p>
              <p className="text-sm font-semibold text-neutral-900">
                -37.500&nbsp;₫
              </p>
            </div>
            <Separator />
            <div className="grid items-center justify-items-end gap-0.5 md:grid-flow-col md:justify-between md:gap-2">
              <p className="text-sm text-neutral-900 md:text-base md:font-semibold">
                Tổng tiền
              </p>
              <p className="text-xl font-bold leading-8 text-red-500 no-underline md:text-2xl">
                448.500&nbsp;₫
              </p>
            </div>
          </div>
          <Button
            className="bg-green-500 hover:bg-green-600 text-lg font-bold"
            onClick={() => navigate("/checkout")}
          >
            Mua hàng
            <span className="ms-1 md:inline inline">(3)</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CartItemBoxBuy;
