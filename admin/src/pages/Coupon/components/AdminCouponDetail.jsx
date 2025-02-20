import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  DollarSign,
  Percent,
  ShoppingBag,
  Users,
} from "lucide-react";
import { convertVND } from "@/utils/convertVND.js";
import { formatDate } from "@/utils/formatDate.js";

const AdminCouponDetail = ({ coupon }) => {
  return (
    <div className="mt-4">
      <Card>
        <CardHeader className="bg-primary/5">
          <CardTitle className="text-lg font-semibold flex items-center justify-between">
            {coupon?.coupon_code}
            <Badge variant="outline">ID: {coupon?.id}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="space-y-4">
            <div className="flex items-center">
              <Percent className="h-4 w-4 mr-2 text-muted-foreground" />
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">
                  Loại giảm giá
                </h4>
                <p className="text-sm mt-1">
                  {coupon?.discount_type === "percentage"
                    ? "Phần trăm"
                    : "Số tiền cố định"}
                </p>
              </div>
            </div>
            <div className="flex items-center">
              <DollarSign className="h-4 w-4 mr-2 text-muted-foreground" />
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">
                  Giá trị giảm
                </h4>
                <p className="text-sm mt-1">
                  {coupon.discount_type === "percentage"
                    ? coupon.discount_value + "%"
                    : convertVND(coupon.discount_value)}
                </p>
              </div>
            </div>
            <div className="flex items-center">
              <ShoppingBag className="h-4 w-4 mr-2 text-muted-foreground" />
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">
                  Giá trị đơn hàng tối thiểu
                </h4>
                <p className="text-sm mt-1">
                  {convertVND(coupon?.minimum_order_value)}
                </p>
              </div>
            </div>
            <div className="flex items-center">
              <Users className="h-4 w-4 mr-2 text-muted-foreground" />
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">
                  Số lượng / Số lần sử dụng tối đa
                </h4>
                <p className="text-sm mt-1">
                  {coupon?.quantity || "Không giới hạn"} /{" "}
                  {coupon?.maximum_uses || "Không giới hạn"}
                </p>
              </div>
            </div>
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">
                  Thời gian hiệu lực
                </h4>
                <p className="text-sm mt-1">
                  {formatDate(coupon?.start_date)} -{" "}
                  {formatDate(coupon?.end_date)}
                </p>
              </div>
            </div>
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">
                Trạng thái
              </h4>
              <Badge
                variant={
                  coupon?.status === "active"
                    ? "success"
                    : coupon?.status === "inactive"
                    ? "secondary"
                    : "destructive"
                }
                className="mt-1"
              >
                {coupon?.status === "active"
                  ? "Hoạt động"
                  : coupon?.status === "inactive"
                  ? "Không hoạt động"
                  : "Hết hạn"}
              </Badge>
            </div>
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">
                Mô tả
              </h4>
              <p className="text-sm mt-1">{coupon?.description}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminCouponDetail;
