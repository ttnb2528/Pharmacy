import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tag, FileText, Info } from "lucide-react";

const AdminShiftWorkDetail = ({ brand }) => {
  return (
    <Card className="w-full max-w-3xl mx-auto max-h-[calc(100vh-120px)] h-fit overflow-y-auto">
      <CardHeader className="pb-4">
        <div className="flex justify-between items-center">
          <CardTitle className="text-2xl font-bold">
            Chi tiết thương hiệu
          </CardTitle>
          <Badge variant="outline" className="text-sm font-semibold">
            Mã: {brand?.id ?? "..."}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Tag className="h-5 w-5" />
            Tên thương hiệu
          </h3>
          <p className="text-lg text-muted-foreground pl-7">
            {brand?.name ?? "..."}
          </p>
        </div>

        <Separator />

        <div className="space-y-2">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Mô tả
          </h3>
          <p className="text-muted-foreground pl-7 whitespace-pre-wrap">
            {brand?.description ?? "..."}
          </p>
        </div>

        <Separator />

        <div className="space-y-2">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Info className="h-5 w-5" />
            Thông tin bổ sung
          </h3>
          <ul className="list-disc list-inside text-muted-foreground pl-7 space-y-1">
            <li>Số sản phẩm: {brand?.productCount ?? "..."}</li>
            <li>
              Ngày tạo:{" "}
              {brand?.createdAt
                ? new Date(brand.createdAt).toLocaleDateString("vi-VN")
                : "..."}
            </li>
            <li>
              Cập nhật lần cuối:{" "}
              {brand?.updatedAt
                ? new Date(brand.updatedAt).toLocaleDateString("vi-VN")
                : "..."}
            </li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminShiftWorkDetail;
