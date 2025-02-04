import { Check, X, Mail, Phone, MapPin, Calendar, User } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

const CustomerDetails = ({ customer }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("vi", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };
  return (
    <Card className="w-full max-h-[calc(100vh-120px)] h-fit overflow-y-auto mx-auto">
      <CardHeader className="flex flex-row items-center gap-4">
        <Avatar className="w-20 h-20 ">
          <AvatarImage
            src={customer?.avatar}
            alt={customer?.name}
            className="bg-cover"
          />
          <AvatarFallback>{customer?.name?.charAt(0) ?? "K"}</AvatarFallback>
        </Avatar>
        <div>
          <CardTitle className="text-2xl">{customer?.name ?? "..."}</CardTitle>
          <p className="text-sm text-muted-foreground">
            Mã KH: {customer?.id ?? "..."}
          </p>
        </div>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid grid-cols-2 gap-4">
          <InfoItem
            icon={Phone}
            label="Số điện thoại"
            value={customer?.phone}
          />
          <InfoItem
            icon={Mail}
            label="Email"
            value={customer?.accountId?.email || customer?.email}
          />
          <InfoItem icon={MapPin} label="Địa chỉ" value={customer?.address} />
          <InfoItem icon={User} label="Giới tính" value={customer?.gender} />
          <InfoItem
            icon={Calendar}
            label="Ngày sinh"
            value={customer?.date ? formatDate(customer.date) : undefined}
          />
        </div>
        <div className="flex items-center gap-2 mt-4">
          <span className="font-semibold">Tài khoản:</span>
          {customer?.accountId ? (
            <Badge variant="success" className="flex items-center gap-1">
              <Check className="w-4 h-4" /> Đã kích hoạt
            </Badge>
          ) : (
            <Badge variant="destructive" className="flex items-center gap-1">
              <X className="w-4 h-4" /> Chưa kích hoạt
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

const InfoItem = ({ icon: Icon, label, value }) => (
  <div className="flex items-center gap-2">
    <Icon className="w-4 h-4 text-muted-foreground" />
    <span className="font-medium">{label}:</span>
    <span>{value ?? "..."}</span>
  </div>
);

export default CustomerDetails;
