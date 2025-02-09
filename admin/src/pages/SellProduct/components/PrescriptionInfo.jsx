import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const PrescriptionInfo = ({ prescriptionInfo, setPrescriptionInfo }) => {
  return (
    <Card className="h-fit">
      <CardHeader>
        <CardTitle>Thông tin đơn thuốc</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Input
            type="text"
            placeholder="Nơi khám"
            value={prescriptionInfo.source}
            onChange={(e) =>
              setPrescriptionInfo({
                ...prescriptionInfo,
                source: e.target.value,
              })
            }
          />
          <Input
            type="text"
            placeholder="Số phiếu khám"
            value={prescriptionInfo.number}
            onChange={(e) =>
              setPrescriptionInfo({
                ...prescriptionInfo,
                number: e.target.value,
              })
            }
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default PrescriptionInfo;
