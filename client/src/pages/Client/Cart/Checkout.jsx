import CheckoutInfo from "./components/CheckoutInfo.jsx";
import { LuTicketPercent, LuX } from "react-icons/lu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useContext, useState } from "react";

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
import { useModalNotification } from "@/pages/component/Notification.jsx";
import SelectCoupon from "./components/SelectCoupon.jsx";
import { PharmacyContext } from "@/context/Pharmacy.context.jsx";
import CoinSvg from "@/pages/component/CoinSvg.jsx";
import { convertVND } from "@/utils/ConvertVND.js";
import { handleRenderPriceWithCoupon } from "@/utils/Calculate.js";
import { apiClient } from "@/lib/api-client.js";
import { CREATE_ORDER_ROUTE } from "@/API/index.api.js";
import { toast } from "sonner";

import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";
import axios from "axios";

const Checkout = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenCoinGold, setIsOpenCoinGold] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [note, setNote] = useState("");

  const { showNotification, ModalNotificationComponent } =
    useModalNotification();

  const {
    cart,
    selectedCoupon,
    setSelectedCoupon,
    CalculateTotalItems,
    CalculateTotalPriceTemp,
    CalculatePriceWithSale,
    CalculateTotalPrice,
    userData,
  } = useContext(PharmacyContext);

  const handleApplyCoupon = (coupon) => {
    if (coupon.minimum_order_value > CalculateTotalPrice()) {
      showNotification({
        title: "Không thể áp dụng mã giảm giá",
        message: "Đơn hàng của bạn chưa đạt điều kiện áp dụng mã giảm giá",
        type: "error",
      });
      return;
    }
    setSelectedCoupon(coupon);
    setIsOpen(false);
  };

  const handleRemoveCoupon = () => {
    setSelectedCoupon(null);
  };

  const handleSubmit = async () => {
    try {
      if (!selectedAddress) {
        showNotification({
          title: "Chưa chọn địa chỉ",
          message: "Vui lòng chọn địa chỉ giao hàng",
          type: "error",
        });
        return;
      }

      const res = await apiClient.post(CREATE_ORDER_ROUTE, {
        AccountId: userData.accountId._id,
        nameCustomer: selectedAddress?.name,
        total: CalculateTotalPrice(),
        type: "online",
        address: selectedAddress
          ? `${selectedAddress.otherDetails}, ${selectedAddress.ward}, ${selectedAddress.district}, ${selectedAddress.province}`
          : "",
        coupon: selectedCoupon?.coupon_code || "",
        paymentMethod: paymentMethod === "online" ? "online" : "COD",
        totalTemp: CalculateTotalPriceTemp(cart),
        shippingFee: CalculateTotalPrice() > 100 ? 0 : 15000,
        discountValue: selectedCoupon ? selectedCoupon.discount_value : 0,
        discountProduct: CalculatePriceWithSale(cart),
        note: note,
        cart: cart,
      });

      if (res.status === 200 && res.data.status === 201) {
        toast.success(res.data.message);
        window.location.href = "/";
      } else {
        showNotification({
          title: "Sản phẩm hết hàng",
          message: res.data.message,
          type: "warning",
        });
      }
    } catch (error) {
      console.error("Lỗi khi tạo đơn hàng:", error);
    }
  };

  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  const paypalOptions = {
    "client-id": import.meta.env.VITE_PAYPAL_CLIENT_ID,
    currency: "USD",
  };

  const createPayPalOrder = async (data, actions) => {
    const exchangeRateResponse = await axios.get(
      "https://api.exchangerate-api.com/v4/latest/VND"
    );
    const exchangeRate = exchangeRateResponse.data.rates.USD; // Tỷ giá USD so với VND
    const usdAmount = (CalculateTotalPrice() * exchangeRate).toFixed(2);
    return actions.order.create({
      purchase_units: [
        {
          amount: {
            value: usdAmount, // Chuyển đổi VND sang USD
          },
        },
      ],
    });
  };

  const onApprovePayPalPayment = async (data, actions) => {
    try {
      setIsProcessingPayment(true);
      const details = await actions.order.capture();

      // Gọi API tạo đơn hàng của bạn với thông tin thanh toán PayPal
      const res = await apiClient.post(CREATE_ORDER_ROUTE, {
        AccountId: userData.accountId._id,
        nameCustomer: selectedAddress?.name,
        total: CalculateTotalPrice(),
        type: "online",
        address: selectedAddress
          ? `${selectedAddress.otherDetails}, ${selectedAddress.ward}, ${selectedAddress.district}, ${selectedAddress.province}`
          : "",
        coupon: selectedCoupon?.coupon_code || "",
        paymentMethod: "PAYPAL",
        totalTemp: CalculateTotalPriceTemp(cart),
        shippingFee: CalculateTotalPrice() > 100 ? 0 : 15000,
        discountValue: selectedCoupon ? selectedCoupon.discount_value : 0,
        discountProduct: CalculatePriceWithSale(cart),
        note: note,
        cart: cart,
        paypalOrderId: details.id,
        paypalPaymentStatus: details.status,
      });

      if (res.status === 200 && res.data.status === 201) {
        toast.success("Thanh toán thành công!");
        window.location.href = "/";
      }
    } catch (error) {
      toast.error("Có lỗi xảy ra trong quá trình thanh toán");
      console.error(error);
    } finally {
      setIsProcessingPayment(false);
    }
  };

  return (
    <div className="relative grid gap-2.5 md:container md:grid-cols-1 md:items-start md:gap-4 md:pt-6 lg:grid-cols-[min(80%,calc(900rem/16)),1fr] md:mb-5">
      <CheckoutInfo
        paymentMethod={paymentMethod}
        setPaymentMethod={setPaymentMethod}
        selectedAddress={selectedAddress}
        setSelectedAddress={setSelectedAddress}
        note={note}
        setNote={setNote}
      />
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
              <SelectCoupon
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                selectedCoupon={selectedCoupon}
                handleApplyCoupon={handleApplyCoupon}
              />
            </div>
            {selectedCoupon && (
              <div className="flex items-center justify-between bg-green-100 p-2 rounded-md">
                <span className="text-sm text-green-700">
                  {selectedCoupon?.coupon_code}
                </span>
                <Button
                  size="sm"
                  variant="ghost"
                  className="p-1 h-auto"
                  onClick={handleRemoveCoupon}
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
                <CoinSvg />
                <p className="font-semibold text-neutral-900">Dùng Xu</p>
              </div>
              <div>
                <Dialog open={isOpenCoinGold} onOpenChange={setIsOpenCoinGold}>
                  <DialogTrigger asChild>
                    <Button variant="none">Tùy chọn</Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Sử dụng Xu</DialogTitle>
                      <Separator />
                      <DialogDescription>
                        Nhập số lượng Xu bạn muốn sử dụng cho đơn hàng này.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="pxu" className="text-right">
                          Xu
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
                          1000 Xu
                        </span>
                      </div>
                      <Separator />
                      <p className="text-sm font-medium text-neutral-900">
                        Số Xu sử dụng phải là bội số của 1000 và không vượt quá
                        50% giá trị đơn hàng
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
              <p className="text-sm text-neutral-900">Xu Vàng hiện có</p>
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
                      {CalculateTotalItems(cart)} sản phẩm
                    </span>
                  </p>
                  <p className="text-sm text-neutral-900">
                    {convertVND(CalculateTotalPriceTemp(cart))}
                  </p>
                </div>

                <div className="grid grid-flow-col items-center justify-between gap-2 md:grid">
                  <p className="text-sm text-neutral-900">Phí vận chuyển</p>
                  <p className="text-sm text-neutral-900">
                    {convertVND(30000)}
                  </p>
                </div>

                <div className="grid grid-flow-col items-center justify-between gap-2 md:grid">
                  <p className="text-sm text-neutral-900">
                    Giảm giá vận chuyển
                  </p>
                  <p className="text-sm text-neutral-900">
                    - {convertVND(30000)}
                  </p>
                </div>

                <div className="grid grid-flow-col items-center justify-between gap-2 md:grid">
                  <p className="text-sm text-neutral-900">Giảm giá ưu đãi</p>
                  <p className="text-sm text-neutral-900">
                    {selectedCoupon
                      ? handleRenderPriceWithCoupon(selectedCoupon)
                      : "-"}
                  </p>
                </div>

                <div className="grid grid-flow-col items-center justify-between gap-2 md:grid">
                  <p className="text-sm text-neutral-900">Giảm giá sản phẩm</p>
                  <p className="text-sm text-neutral-900">
                    {" "}
                    - {convertVND(CalculatePriceWithSale(cart))}
                  </p>
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
                      {CalculateTotalItems(cart)} sản phẩm
                    </p>
                  </div>
                  <p className="text-base font-semibold leading-5 text-red-500 no-underline md:text-2xl md:font-bold md:leading-8">
                    {convertVND(CalculateTotalPrice())}
                  </p>
                </div>
              </div>

              {/* <Button
                className="bg-green-500 text-white hover:bg-green-600"
                onClick={handleSubmit}
              >
                Đặt hàng
              </Button> */}

              {paymentMethod === "COD" ? (
                <Button
                  className="bg-green-500 text-white hover:bg-green-600"
                  onClick={handleSubmit}
                >
                  Đặt hàng
                </Button>
              ) : (
                <PayPalScriptProvider options={paypalOptions}>
                  <PayPalButtons
                    style={{ layout: "horizontal" }}
                    createOrder={createPayPalOrder}
                    onApprove={onApprovePayPalPayment}
                    onError={(err) => {
                      toast.error("Có lỗi xảy ra với PayPal");
                      console.error(err);
                    }}
                    disabled={isProcessingPayment}
                  />
                </PayPalScriptProvider>
              )}
            </div>
          </div>
        </div>
      </div>
      {ModalNotificationComponent}
    </div>
  );
};

export default Checkout;
