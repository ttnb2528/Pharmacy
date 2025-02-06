import { useContext, useEffect, useState } from "react";
import { User, Phone, MapPin, Users, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Header from "../component/Header.jsx";
import { ProfileContext } from "@/context/ProfileContext.context.jsx";
import { apiClient } from "@/lib/api-admin.js";
import { UPDATE_STAFF_ROUTE } from "@/API/index.api.js";
import { toast } from "sonner";

const ProfilePage = () => {
  const { userData, setUserData } = useContext(ProfileContext);
  const [formData, setFormData] = useState({
    name: "",
    gender: "",
    date: "",
    phone: "",
    address: "",
  });

  useEffect(() => {
    if (userData) {
      setFormData({
        name: userData.name,
        gender: userData.gender,
        date: userData.date,
        phone: userData.phone,
        address: userData.address,
      });
    }
  }, [userData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSelectChange = (name, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await apiClient.put(
        `${UPDATE_STAFF_ROUTE}/${userData._id}`,
        formData
      );

      console.log(res);

      if (res.status === 200 && res.data.status === 200) {
        toast.success("Cập nhật hồ sơ thành công");
        setUserData(res.data.data);
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <Header title={"Hồ sơ"} />
      <Card className="max-w-2xl mx-auto mt-4">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Hồ sơ cá nhân</CardTitle>
          <CardDescription>
            Xem và cập nhật thông tin cá nhân của bạn
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Họ và tên</Label>
                <div className="relative">
                  <User className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="name"
                    name="name"
                    value={formData?.name ?? ""}
                    onChange={handleInputChange}
                    className="pl-8"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="gender">Giới tính</Label>
                <div className="relative">
                  <Users className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Select
                    name="gender"
                    value={formData?.gender ?? ""}
                    onValueChange={(value) =>
                      handleSelectChange("gender", value)
                    }
                  >
                    <SelectTrigger className="w-full pl-8">
                      <SelectValue placeholder="Chọn giới tính" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Nam">Nam</SelectItem>
                      <SelectItem value="Nữ">Nữ</SelectItem>
                      <SelectItem value="Khác">Khác</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="date">Ngày sinh</Label>
                <div className="relative">
                  <Calendar className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="date"
                    name="date"
                    type="date"
                    value={
                      formData?.date
                        ? new Date(formData?.date).toISOString().split("T")[0]
                        : ""
                    }
                    onChange={handleInputChange}
                    className="pl-8"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Số điện thoại</Label>
                <div className="relative">
                  <Phone className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="phone"
                    name="phone"
                    value={formData?.phone ?? ""}
                    onChange={handleInputChange}
                    className="pl-8"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Địa chỉ</Label>
                <div className="relative">
                  <MapPin className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="address"
                    name="address"
                    value={formData?.address ?? ""}
                    onChange={handleInputChange}
                    className="pl-8"
                  />
                </div>
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter>
          <Button type="submit" onClick={handleSubmit}>
            Cập nhật hồ sơ
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ProfilePage;
