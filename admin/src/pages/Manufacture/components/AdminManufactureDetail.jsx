import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const AdminManufactureDetail = ({ manufacture }) => {
  return (
    <div className="mt-4">
      <Card>
        <CardHeader className="bg-primary/5">
          <CardTitle className="text-lg font-semibold flex items-center justify-between">
            {manufacture?.name}
            <Badge variant="outline">ID: {manufacture?.id}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">
                Nước
              </h4>
              <p className="text-sm mt-1">{manufacture?.country || "..."}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">
                Số lượng sản phẩm
              </h4>
              <p className="text-sm mt-1">{manufacture?.productCount || 0}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminManufactureDetail;
