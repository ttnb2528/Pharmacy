import CheckoutInfo from "./components/CheckoutInfo.jsx";
import { LuTicketPercent, LuX } from "react-icons/lu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator.jsx";

const Checkout = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenCoinGold, setIsOpenCoinGold] = useState(false);
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
    <div className="relative grid gap-2.5 md:container md:grid-cols-1 md:items-start md:gap-4 md:pt-6 lg:grid-cols-[min(80%,calc(1024rem/16)),1fr] md:mb-5">
      <CheckoutInfo />
      <div
        className="sticky top-[calc(var(--header-position-start-sticky)+12px)] contents content-start gap-4 md:grid"
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

        <div className="order-6 md:order-3">
          <div className="flex flex-col space-y-3 rounded-sm bg-white p-4  md:p-3">
            <div className="grid w-full grid-flow-col items-center justify-between md:text-sm">
              <div className="grid grid-cols-[24px_1fr] items-center justify-start gap-1">
                <div className="">icon</div>
                <p className="font-semibold text-neutral-900">Dùng P-Xu Vàng</p>
              </div>
              <div>
                <Dialog open={isOpenCoinGold} onOpenChange={setIsOpenCoinGold}>
                  <DialogTrigger asChild>
                    <Button variant="none">Tùy chọn</Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Sử dụng P-Xu Vàng</DialogTitle>
                      <Separator />
                      <DialogDescription>
                        Nhập số lượng P-Xu Vàng bạn muốn sử dụng cho đơn hàng
                        này.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="pxu" className="text-right">
                          P-Xu Vàng
                        </Label>
                        <Input
                          id="pxu"
                          type="number"
                          className="col-span-3"
                          placeholder="Nhập số lượng P-Xu Vàng"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label className="text-right">Có sẵn</Label>
                        <span className="col-span-3 font-semibold">
                          1000 P-Xu Vàng
                        </span>
                      </div>
                      <Separator />
                      <p className="text-sm font-medium text-neutral-900">
                        Số P-Xu sử dụng phải là bội số của 1000 và không vượt
                        quá 50% giá trị đơn hàng
                      </p>
                    </div>
                    <DialogFooter>
                      <Button
                        type="submit"
                        onClick={() => setIsOpenCoinGold(false)}
                      >
                        Áp dụng
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>

            <div className="hidden w-full grid-flow-col items-center justify-between md:grid">
              <p className="text-sm text-neutral-900">P-Xu Vàng hiện có</p>
              <p className="text-sm text-neutral-900">10.000</p>
            </div>
          </div>
        </div>

        <div className="order-7">
          <div className="space-y-2">
            <div className="p-4 pb-0 grid grid-flow-col items-center gap-2 rounded-sm bg-white md:grid-flow-row md:items-start md:gap-8 md:p-4">
              <div className="grid gap-3 md:gap-4">
                <p className="grid text-base font-semibold text-neutral-900 md:block">
                  Chi tiết thanh toán
                </p>
                <div className="grid grid-flow-col items-center justify-between gap-2 md:grid">
                  <p className="text-sm text-neutral-900">
                    <span>Tạm tính</span>
                    <span className="ms-1 inline text-sm text-neutral-700 md:hidden">
                      (3 sản phẩm)
                    </span>
                  </p>
                  <p className="text-sm text-neutral-900">486.000&nbsp;₫</p>
                </div>

                <div className="grid grid-flow-col items-center justify-between gap-2 md:grid">
                  <p className="text-sm text-neutral-900">Phí vận chuyển</p>
                  <p className="text-sm text-neutral-900">31.000&nbsp;₫</p>
                </div>

                <div className="grid grid-flow-col items-center justify-between gap-2 md:grid">
                  <p className="text-sm text-neutral-900">
                    Giảm giá vận chuyển
                  </p>
                  <p className="text-sm text-neutral-900">-31.000&nbsp;₫</p>
                </div>

                <div className="grid grid-flow-col items-center justify-between gap-2 md:grid">
                  <p className="text-sm text-neutral-900">Giảm giá ưu đãi</p>
                  <p className="text-sm text-neutral-900">-30.000&nbsp;₫</p>
                </div>

                <div className="grid grid-flow-col items-center justify-between gap-2 md:grid">
                  <p className="text-sm text-neutral-900">Giảm giá sản phẩm</p>
                  <p className="text-sm text-neutral-900">-37.500&nbsp;₫</p>
                </div>

                <Separator />

                <div className="grid grid-flow-col justify-between items-center justify-items-end gap-0.5 md:grid-flow-col md:justify-between md:gap-2">
                  <div className=" grid gap-1">
                    <p className="hidden text-sm text-neutral-900 md:block md:text-base md:font-semibold">
                      Tổng tiền
                    </p>
                    <p className="block text-sm font-bold text-neutral-900 md:hidden">
                      Tổng thanh toán
                    </p>
                    <p className="hidden text-sm text-neutral-900 md:block">
                      3 sản phẩm
                    </p>
                  </div>
                  <p className="text-base font-semibold leading-5 text-red-500 no-underline md:text-2xl md:font-bold md:leading-8">
                    418.500&nbsp;₫
                  </p>
                </div>
              </div>

              <Button className="bg-green-500 text-white hover:bg-green-600">
                Đặt hàng
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
