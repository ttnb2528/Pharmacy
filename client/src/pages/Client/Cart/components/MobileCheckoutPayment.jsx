import { useState } from "react";
import { CreditCard, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { IoIosCash } from "react-icons/io";
import { FaCcPaypal } from "react-icons/fa";
import { SiVisa } from "react-icons/si"; // Using SiVisa as a substitute for VNPay

const MobileCheckoutPayment = ({ paymentMethod, setPaymentMethod }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [tempPaymentMethod, setTempPaymentMethod] = useState("");

  const handleOpen = () => {
    setTempPaymentMethod(paymentMethod);
    setIsOpen(true);
  };

  const handleSave = () => {
    setPaymentMethod(tempPaymentMethod);
    setIsOpen(false);
  };

  const getPaymentMethodLabel = (method) => {
    switch (method) {
      case "COD":
        return "Thanh toán khi nhận hàng (COD)";
      case "PAYPAL":
        return "PayPal";
      case "VNPAY":
        return "VNPay";
      default:
        return "Chọn phương thức thanh toán";
    }
  };

  const getPaymentMethodIcon = (method) => {
    switch (method) {
      case "COD":
        return <IoIosCash className="h-5 w-5 text-green-600" />;
      case "PAYPAL":
        return <FaCcPaypal className="h-5 w-5 text-blue-600" />;
      case "VNPAY":
        return <SiVisa className="h-5 w-5 text-blue-600" />;
      default:
        return null;
    }
  };

  return (
    <div className="bg-white p-4 rounded-md">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <CreditCard className="h-5 w-5 text-green-600" />
          <h2 className="font-semibold">Phương thức thanh toán</h2>
        </div>

        <Button
          variant="ghost"
          size="sm"
          className="text-green-600 p-0 h-auto flex items-center"
          onClick={handleOpen}
        >
          Thay đổi
          <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </div>

      <div className="flex items-center gap-2 mt-2">
        {getPaymentMethodIcon(paymentMethod)}
        <span className="text-sm">{getPaymentMethodLabel(paymentMethod)}</span>
      </div>

      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent side="bottom" className="h-[60vh]">
          <SheetHeader>
            <SheetTitle>Chọn phương thức thanh toán</SheetTitle>
          </SheetHeader>

          <div className="py-4">
            <RadioGroup
              value={tempPaymentMethod}
              onValueChange={setTempPaymentMethod}
            >
              <div className="flex items-center space-x-2 space-y-0 mb-4">
                <RadioGroupItem
                  value="COD"
                  id="payment-cod"
                  className="border-green-500 text-green-500 focus:ring-green-500 data-[state=checked]:bg-green-500 data-[state=checked]:text-white"
                />
                <Label
                  htmlFor="payment-cod"
                  className="flex items-center gap-3"
                >
                  <IoIosCash className="h-6 w-6 text-green-600" />
                  <span>Thanh toán khi nhận hàng (COD)</span>
                </Label>
              </div>

              <div className="flex items-center space-x-2 space-y-0 mb-4">
                <RadioGroupItem
                  value="PAYPAL"
                  id="payment-paypal"
                  className="border-green-500 text-green-500 focus:ring-green-500 data-[state=checked]:bg-green-500 data-[state=checked]:text-white"
                />
                <Label
                  htmlFor="payment-paypal"
                  className="flex items-center gap-3"
                >
                  <FaCcPaypal className="h-6 w-6 text-blue-600" />
                  <span>PayPal</span>
                </Label>
              </div>

              <div className="flex items-center space-x-2 space-y-0">
                <RadioGroupItem
                  value="VNPAY"
                  id="payment-vnpay"
                  className="border-green-500 text-green-500 focus:ring-green-500 data-[state=checked]:bg-green-500 data-[state=checked]:text-white"
                />
                <Label
                  htmlFor="payment-vnpay"
                  className="flex items-center gap-3"
                >
                  <SiVisa className="h-6 w-6 text-blue-600" />
                  <span>VNPay</span>
                </Label>
              </div>
            </RadioGroup>
          </div>

          <SheetFooter>
            <Button
              className="w-full bg-green-500 hover:bg-green-600"
              onClick={handleSave}
            >
              Xác nhận
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default MobileCheckoutPayment;
