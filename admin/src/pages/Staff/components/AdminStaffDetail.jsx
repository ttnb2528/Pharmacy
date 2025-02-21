import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Phone, User, Calendar, Briefcase } from "lucide-react";
import { formatDate } from "@/utils/formatDate.js";

const AdminStaffDetail = ({ staff }) => {
  return (
    <div className="mt-4">
      <Card>
        <CardHeader className="bg-primary/5">
          <CardTitle className="text-lg font-semibold flex items-center justify-between">
            {staff?.name}
            <Badge variant="secondary">Nhân viên</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="space-y-4">
            <div className="flex items-center">
              <User className="h-4 w-4 mr-2 text-muted-foreground" />
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">
                  Tên đăng nhập
                </h4>
                <p className="text-sm mt-1">{staff?.username}</p>
              </div>
            </div>
            <div className="flex items-center">
              <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">
                  Số điện thoại
                </h4>
                <p className="text-sm mt-1">{staff?.phone}</p>
              </div>
            </div>
            <div className="flex items-center">
              <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">
                  Địa chỉ
                </h4>
                <p className="text-sm mt-1">{staff?.address}</p>
              </div>
            </div>
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">
                  Ngày sinh
                </h4>
                <p className="text-sm mt-1">
                  {staff?.date ? formatDate(staff?.date) : "..."}
                </p>
              </div>
            </div>
            <div className="flex items-center">
              <Briefcase className="h-4 w-4 mr-2 text-muted-foreground" />
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">
                  Ngày vào làm
                </h4>
                <p className="text-sm mt-1">{formatDate(staff?.workDate)}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminStaffDetail;
