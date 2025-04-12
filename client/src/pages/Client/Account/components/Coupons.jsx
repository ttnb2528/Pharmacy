import { PharmacyContext } from "@/context/Pharmacy.context.jsx";
import { useContext } from "react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { LuTicket } from "react-icons/lu";
import { useMediaQuery } from "@/hook/use-media-query.js";
import MobileAccountHeaderChild from "./MobileAccountHeaderChild.jsx";

const Coupons = () => {
  const { couponData } = useContext(PharmacyContext);
  const isMobile = useMediaQuery("(max-width: 640px)");

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <>
      {isMobile && <MobileAccountHeaderChild title="Mã Giảm Giá" />}

      <div className="my-2 py-2 md:my-0 md:py-0">
        {!isMobile && (
          <h2 className="text-xl font-semibold mb-4">Mã Giảm Giá</h2>
        )}

        <div className="mt-2 grid gap-4 bg-white p-4 md:mt-0 md:grid-cols-3 md:rounded-md md:p-6 xl:grid-cols-3">
          {couponData.length > 0 ? (
            couponData.map((coupon) => (
              <Card
                key={coupon._id}
                className="border border-gray-200 shadow-sm overflow-hidden"
              >
                <CardHeader className="bg-gray-50 ">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-bold text-green-600">
                      {coupon.coupon_code}
                    </CardTitle>
                    <LuTicket className="h-6 w-6 text-green-500" />
                  </div>
                  <CardDescription>{coupon.description}</CardDescription>
                </CardHeader>

                <CardFooter className="flex flex-col items-start">
                  <p className="text-xs text-gray-500">
                    HSD: {formatDate(coupon.end_date)}
                  </p>
                  <Badge
                    variant={
                      coupon.status === "active" ? "success" : "secondary"
                    }
                    className="mt-2"
                  >
                    {coupon.status === "active"
                      ? "Đang hoạt động"
                      : "Không hoạt động"}
                  </Badge>
                </CardFooter>
              </Card>
            ))
          ) : (
            <div className="text-center text-gray-500 font-semibold col-span-full">
              Tạm thời chưa có mã khuyến mãi
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Coupons;
