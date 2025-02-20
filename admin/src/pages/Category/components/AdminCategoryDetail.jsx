import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const AdminCategoryDetail = ({ category }) => {
  return (
    <div className="mt-4">
      <Card>
        <CardHeader className="bg-primary/5">
          <CardTitle className="text-lg font-semibold flex items-center justify-between">
            {category?.name}
            <Badge variant="outline">ID: {category?.id}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">
                Mô tả
              </h4>
              <p className="text-sm mt-1">
                {category?.description || "Không có mô tả"}
              </p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">
                Số lượng sản phẩm
              </h4>
              <p className="text-sm mt-1">{category?.productCount || 0}</p>
            </div>
            {/* <div>
          <h4 className="text-sm font-medium text-muted-foreground">
            Ngày tạo
          </h4>
          <p className="text-sm mt-1">
            {formatDate(
              category?.createdAt || new Date()
            )}
          </p>
        </div> */}
            {/* <div>
          <h4 className="text-sm font-medium text-muted-foreground">
            Cập nhật lần cuối
          </h4>
          <p className="text-sm mt-1">
            {formatDate(
              category?.updatedAt || new Date()
            )}
          </p>
        </div> */}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminCategoryDetail;
