import CheckoutInfo from "./components/CheckoutInfo.jsx";
import { LuTicketPercent, LuX } from "react-icons/lu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useContext, useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator.jsx";
import { useModalNotification } from "@/pages/component/Notification.jsx";
import SelectCoupon from "./components/SelectCoupon.jsx";
import { PharmacyContext } from "@/context/Pharmacy.context.jsx";
import CoinSvg from "@/pages/component/CoinSvg.jsx";
import { convertVND } from "@/utils/ConvertVND.js";
import { handleRenderPriceWithCoupon } from "@/utils/Calculate.js";
import { apiClient } from "@/lib/api-client.js";
import {
  CREATE_ORDER_ROUTE,
  CREATE_VNPAY_ORDER_ROUTE,
} from "@/API/index.api.js";
import { toast } from "sonner";

import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";
import axios from "axios";
import { useAppStore } from "@/store/index.js";
import { useMediaQuery } from "@/hook/use-media-query.js";
import MobileCheckoutHeader from "./components/MobileCheckoutHeader.jsx";
import MobileCheckoutAddress from "./components/MobileCheckoutAddress.jsx";
import MobileCheckoutDelivery from "./components/MobileCheckoutDelivery.jsx";
import MobileCheckoutProducts from "./components/MobileCheckoutProducts.jsx";
import MobileCheckoutNote from "./components/MobileCheckoutNote.jsx";
import MobileCheckoutPayment from "./components/MobileCheckoutPayment.jsx";
import MobileCheckoutCoins from "./components/MobileCheckoutCoins.jsx";
import MobileCheckoutSummary from "./components/MobileCheckoutSummary.jsx";
import MobileCheckoutFooter from "./components/MobileCheckoutFooter.jsx";

const Checkout = () => {
  const { userInfo } = useAppStore();
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenCoinGold, setIsOpenCoinGold] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [note, setNote] = useState("");
  const [coinUsed, setCoinUsed] = useState(0);
  const [tempCoinInput, setTempCoinInput] = useState("");
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const isMobile = useMediaQuery("(max-width: 640px)");

  const { showNotification, ModalNotificationComponent } =
    useModalNotification();

  const handleApplyCoin = () => {
    const coinValue = parseInt(tempCoinInput) || 0;
    const totalPrice = CalculateTotalPrice();
    const maxCoinAllowed = Math.floor(totalPrice * 0.5); // Giới hạn 50% giá trị đơn hàng
    const availableCoins = userInfo?.accountId?.loyaltyProgramId?.points || 0;

    if (coinValue % 1000 !== 0) {
      showNotification({
        title: "Số Xu không hợp lệ",
        message: "Số Xu sử dụng phải là bội số của 1000",
        type: "error",
      });
      return;
    }

    if (coinValue > maxCoinAllowed) {
      showNotification({
        title: "Số Xu vượt quá giới hạn",
        message: "Bạn chỉ có thể sử dụng tối đa 50% giá trị đơn hàng",
        type: "error",
      });
      return;
    }

    if (coinValue > availableCoins) {
      showNotification({
        title: "Không đủ Xu",
        message: "Bạn không có đủ Xu để sử dụng",
        type: "error",
      });
      return;
    }

    setCoinUsed(coinValue); // Chỉ cập nhật khi nhấn "Áp dụng"
    setTempCoinInput(""); // Reset input sau khi áp dụng
    setIsOpenCoinGold(false); // Đóng dialog
  };

  const {
    cart,
    selectedCoupon,
    setSelectedCoupon,
    CalculateTotalItems,
    CalculateTotalPriceTemp,
    CalculatePriceWithSale,
    CalculateTotalPrice,
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
        AccountId: userInfo.accountId._id,
        nameCustomer: selectedAddress?.name,
        phone: userInfo.phone,
        total: CalculateTotalPrice() - coinUsed,
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
        coinUsed: coinUsed,
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
      toast.error("Có lỗi xảy ra khi tạo đơn hàng");
    }
  };

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

      // Lấy captureId từ details
      const captureId = details.purchase_units[0].payments.captures[0].id;

      // Gọi API tạo đơn hàng của bạn với thông tin thanh toán PayPal
      const res = await apiClient.post(CREATE_ORDER_ROUTE, {
        AccountId: userInfo.accountId._id,
        nameCustomer: selectedAddress?.name,
        phone: userInfo.phone,
        total: CalculateTotalPrice() - coinUsed,
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
        paypalCaptureId: captureId,
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

  // VNPay Payment
  const handleVNPayPayment = async () => {
    try {
      if (!selectedAddress) {
        showNotification({
          title: "Chưa chọn địa chỉ",
          message: "Vui lòng chọn địa chỉ giao hàng",
          type: "error",
        });
        return;
      }

      const orderId = `ORDER_${Date.now()}`;
      const res = await apiClient.post(CREATE_ORDER_ROUTE, {
        AccountId: userInfo.accountId._id,
        nameCustomer: selectedAddress?.name,
        phone: userInfo.phone,
        total: CalculateTotalPrice() - coinUsed,
        type: "online",
        address: selectedAddress
          ? `${selectedAddress.otherDetails}, ${selectedAddress.ward}, ${selectedAddress.district}, ${selectedAddress.province}`
          : "",
        coupon: selectedCoupon?.coupon_code || "",
        paymentMethod: "VNPAY",
        totalTemp: CalculateTotalPriceTemp(cart),
        shippingFee: CalculateTotalPrice() > 100 ? 0 : 15000,
        discountValue: selectedCoupon ? selectedCoupon.discount_value : 0,
        discountProduct: CalculatePriceWithSale(cart),
        note: note,
        cart: cart,
        status: "pending",
        vnpTxnRef: orderId,
      });

      if (res.status === 200 && res.data.status === 201) {
        const vnpayRes = await apiClient.post(CREATE_VNPAY_ORDER_ROUTE, {
          orderId,
          amount: CalculateTotalPrice(),
          bankCode: "NCB", // Tùy chọn, có thể để trống
          language: "vn",
        });
        window.location.href = vnpayRes.data.paymentUrl;
      }
    } catch (error) {
      toast.error("Lỗi khi tạo thanh toán VNPay");
      console.error(error);
    }
  };

  const formatNumber = (number) => {
    return number.toLocaleString("vi-VN");
  };

  return (
    <>
      {isMobile && <MobileCheckoutHeader />}

      <div className="relative grid gap-2.5 md:container md:grid-cols-1 md:items-start md:gap-4 md:pt-6 lg:grid-cols-[min(80%,calc(900rem/16)),1fr] md:mb-5">
        {isMobile ? (
          <>
            <div className={`space-y-4 ${selectedCoupon ? "mb-44" : "mb-32"}`}>
              <MobileCheckoutAddress
                selectedAddress={selectedAddress}
                setSelectedAddress={setSelectedAddress}
              />

              <MobileCheckoutDelivery />

              <MobileCheckoutProducts />

              <MobileCheckoutNote note={note} setNote={setNote} />

              <MobileCheckoutPayment
                paymentMethod={paymentMethod}
                setPaymentMethod={setPaymentMethod}
              />

              <MobileCheckoutCoins
                coinUsed={coinUsed}
                setCoinUsed={setCoinUsed}
                tempCoinInput={tempCoinInput}
                setTempCoinInput={setTempCoinInput}
                handleApplyCoin={handleApplyCoin}
                isOpenCoinGold={isOpenCoinGold}
                setIsOpenCoinGold={setIsOpenCoinGold}
                formatNumber={formatNumber}
              />

              <MobileCheckoutSummary
                CalculateTotalItems={CalculateTotalItems}
                CalculateTotalPriceTemp={CalculateTotalPriceTemp}
                CalculatePriceWithSale={CalculatePriceWithSale}
                CalculateTotalPrice={CalculateTotalPrice}
                cart={cart}
                selectedCoupon={selectedCoupon}
                coinUsed={coinUsed}
              />
            </div>

            <MobileCheckoutFooter
              CalculateTotalPrice={CalculateTotalPrice}
              selectedCoupon={selectedCoupon}
              setSelectedCoupon={setSelectedCoupon}
              coinUsed={coinUsed}
              paymentMethod={paymentMethod}
              handleSubmit={handleSubmit}
              handleVNPayPayment={handleVNPayPayment}
              createPayPalOrder={createPayPalOrder}
              onApprovePayPalPayment={onApprovePayPalPayment}
              isProcessingPayment={isProcessingPayment}
              paypalOptions={paypalOptions}
            />
          </>
        ) : (
          <>
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
                <div className="flex flex-col space-y-3 rounded-sm bg-white p-4 md:p-3">
                  <div className="grid w-full grid-flow-col items-center justify-between md:text-sm">
                    <div className="grid grid-cols-[24px_1fr] items-center justify-start gap-1">
                      <CoinSvg />
                      <p className="font-semibold text-neutral-900">Dùng Xu</p>
                    </div>
                    <div>
                      <Button
                        variant="none"
                        onClick={() => setIsOpenCoinGold(true)}
                      >
                        Tùy chọn
                      </Button>
                    </div>
                  </div>

                  <div className="hidden w-full grid-flow-col items-center justify-between md:grid">
                    <p className="text-sm text-neutral-900">Xu Vàng hiện có</p>
                    <p className="text-sm text-neutral-900">
                      {formatNumber(
                        userInfo?.accountId?.loyaltyProgramId?.points
                      )}{" "}
                      xu
                    </p>
                  </div>

                  {coinUsed > 0 && (
                    <div className="grid grid-flow-col items-center justify-between gap-2 md:grid">
                      <p className="text-sm text-neutral-900">Số Xu sử dụng</p>
                      <p className="text-sm text-neutral-900">
                        {formatNumber(coinUsed)} xu
                      </p>
                    </div>
                  )}
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
                        <p className="text-sm text-neutral-900">
                          Phí vận chuyển
                        </p>
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
                        <p className="text-sm text-neutral-900">
                          Giảm giá ưu đãi
                        </p>
                        <p className="text-sm text-neutral-900">
                          {selectedCoupon
                            ? handleRenderPriceWithCoupon(selectedCoupon)
                            : "-"}
                        </p>
                      </div>

                      <div className="grid grid-flow-col items-center justify-between gap-2 md:grid">
                        <p className="text-sm text-neutral-900">
                          Giảm giá sản phẩm
                        </p>
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
                          {convertVND(CalculateTotalPrice() - coinUsed)}
                        </p>
                      </div>
                    </div>

                    {paymentMethod === "COD" ? (
                      <Button
                        className="bg-green-500 text-white hover:bg-green-600"
                        onClick={handleSubmit}
                      >
                        Đặt hàng
                      </Button>
                    ) : paymentMethod === "PAYPAL" ? (
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
                    ) : paymentMethod === "VNPAY" ? (
                      <Button
                        className="bg-blue-500 text-white hover:bg-blue-600"
                        onClick={handleVNPayPayment}
                      >
                        Thanh toán qua VNPay
                      </Button>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Dialog cho nhập xu trên desktop */}
      <Dialog open={isOpenCoinGold} onOpenChange={setIsOpenCoinGold}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Sử dụng Xu Vàng</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <div className="col-span-4">
                <p className="text-sm text-neutral-700 mb-2">
                  Bạn có {formatNumber(userInfo?.accountId?.loyaltyProgramId?.points || 0)} xu
                </p>
                <p className="text-xs text-neutral-500 mb-4">
                  Có thể sử dụng tối đa {formatNumber(Math.floor(CalculateTotalPrice() * 0.5))} xu (50% giá trị đơn hàng)
                </p>
                <Input
                  id="coinInput"
                  type="number"
                  placeholder="Nhập số xu bạn muốn sử dụng"
                  value={tempCoinInput}
                  onChange={(e) => setTempCoinInput(e.target.value)}
                  className="col-span-3"
                />
                <p className="text-xs text-neutral-500 mt-1">
                  Số xu phải là bội số của 1000
                </p>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsOpenCoinGold(false)}>
              Hủy
            </Button>
            <Button onClick={handleApplyCoin} className="bg-green-500 hover:bg-green-600">
              Áp dụng
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {ModalNotificationComponent}
    </>
  );
};

export default Checkout;
