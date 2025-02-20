import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Phone } from "lucide-react";

const AdminSupplierDetail = ({ supplier }) => {
  return (
    <div className="mt-4">
      <Card>
        <CardHeader className="bg-primary/5">
          <CardTitle className="text-lg font-semibold flex items-center justify-between">
            {supplier?.name}
            <Badge variant="outline">ID: {supplier?.id}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="space-y-4">
            <div className="flex items-center">
              <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">
                  Địa chỉ
                </h4>
                <p className="text-sm mt-1">{supplier?.address}</p>
              </div>
            </div>
            <div className="flex items-center">
              <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">
                  Số điện thoại
                </h4>
                <p className="text-sm mt-1">{supplier?.phone}</p>
              </div>
            </div>
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">
                Trạng thái
              </h4>
              <Badge
                variant={supplier?.isDeleted ? "destructive" : "success"}
                className="mt-1"
              >
                {supplier?.isDeleted ? "Đã xóa" : "Hoạt động"}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminSupplierDetail;
