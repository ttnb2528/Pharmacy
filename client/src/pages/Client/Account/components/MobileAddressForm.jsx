import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { apiClient } from "@/lib/api-client.js";
import { toast } from "sonner";
import {
  GET_PROVINCES_ROUTE,
  GET_DISTRICTS_ROUTE,
  GET_WARDS_ROUTE,
} from "@/API/index.api.js";
import Loading from "@/pages/component/Loading.jsx";

const MobileAddressForm = ({
  isOpen,
  onClose,
  address,
  setAddress,
  isEditing = false,
  onSubmit,
  isMobile = false,
}) => {
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        setIsLoading(true);
        const response = await apiClient.get(GET_PROVINCES_ROUTE);
        if (response.status === 200 && response.data.status === 200) {
          setProvinces(response.data.data);
        } else {
          setProvinces([]);
        }
      } catch (error) {
        console.error("Error fetching provinces:", error);
        toast.error("Không thể tải danh sách tỉnh/thành phố");
      } finally {
        setIsLoading(false);
      }
    };

    if (isOpen) {
      fetchProvinces();
    }
  }, [isOpen]);

  useEffect(() => {
    const fetchDistricts = async () => {
      if (address.provinceId) {
        try {
          setIsLoading(true);
          const response = await apiClient.get(
            `${GET_DISTRICTS_ROUTE}/${address.provinceId}`
          );
          if (response.status === 200 && response.data.status === 200) {
            setDistricts(response.data.data);
          } else {
            setDistricts([]);
          }
        } catch (error) {
          console.error("Error fetching districts:", error);
          toast.error("Không thể tải danh sách quận/huyện");
        } finally {
          setIsLoading(false);
        }
      } else {
        setDistricts([]);
      }
    };

    if (address.provinceId) {
      fetchDistricts();
    }
  }, [address.provinceId]);

  useEffect(() => {
    const fetchWards = async () => {
      if (address.districtId) {
        try {
          setIsLoading(true);
          const response = await apiClient.get(
            `${GET_WARDS_ROUTE}/${address.districtId}`
          );
          if (response.status === 200 && response.data.status === 200) {
            setWards(response.data.data);
          } else {
            setWards([]);
          }
        } catch (error) {
          console.error("Error fetching wards:", error);
          toast.error("Không thể tải danh sách phường/xã");
        } finally {
          setIsLoading(false);
        }
      } else {
        setWards([]);
      }
    };

    if (address.districtId) {
      fetchWards();
    }
  }, [address.districtId]);

  const handleProvinceChange = (value) => {
    const selectedProvince = provinces.find((p) => p.province_name === value);
    if (selectedProvince) {
      setAddress({
        ...address,
        province: selectedProvince.province_name,
        provinceId: selectedProvince.province_id,
        district: "",
        districtId: null,
        ward: "",
        wardId: null,
      });
    }
  };

  const handleDistrictChange = (value) => {
    const selectedDistrict = districts.find((d) => d.district_name === value);
    if (selectedDistrict) {
      setAddress({
        ...address,
        district: selectedDistrict.district_name,
        districtId: selectedDistrict.district_id,
        ward: "",
        wardId: null,
      });
    }
  };

  const handleWardChange = (value) => {
    const selectedWard = wards.find((w) => w.ward_name === value);
    if (selectedWard) {
      setAddress({
        ...address,
        ward: selectedWard.ward_name,
        wardId: selectedWard.ward_id,
      });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAddress({
      ...address,
      [name]: value,
    });
  };

  const handleCheckboxChange = (checked) => {
    setAddress({
      ...address,
      isDefault: checked,
    });
  };

  const validateForm = () => {
    if (!address.name.trim()) {
      toast.error("Vui lòng nhập họ tên");
      return false;
    }
    if (!address.phone.trim()) {
      toast.error("Vui lòng nhập số điện thoại");
      return false;
    }
    if (!address.province) {
      toast.error("Vui lòng chọn tỉnh/thành phố");
      return false;
    }
    if (!address.district) {
      toast.error("Vui lòng chọn quận/huyện");
      return false;
    }
    if (!address.ward) {
      toast.error("Vui lòng chọn phường/xã");
      return false;
    }
    if (!address.otherDetails.trim()) {
      toast.error("Vui lòng nhập địa chỉ cụ thể");
      return false;
    }
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    onSubmit(e);
  };

  // Form content that's shared between mobile and desktop
  const formContent = (
    <>
      {isLoading && <Loading />}
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Họ và tên</Label>
          <Input
            id="name"
            name="name"
            value={address.name}
            onChange={handleChange}
            placeholder="Nhập họ và tên"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Số điện thoại</Label>
          <Input
            id="phone"
            name="phone"
            value={address.phone}
            onChange={handleChange}
            placeholder="Nhập số điện thoại"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="province">Tỉnh/Thành phố</Label>
          <Select value={address.province} onValueChange={handleProvinceChange}>
            <SelectTrigger>
              <SelectValue placeholder="Chọn tỉnh/thành phố" />
            </SelectTrigger>
            <SelectContent>
              {provinces.map((province) => (
                <SelectItem
                  key={province.province_id}
                  value={province.province_name}
                >
                  {province.province_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="district">Quận/Huyện</Label>
          <Select
            value={address.district}
            onValueChange={handleDistrictChange}
            disabled={!address.province}
          >
            <SelectTrigger>
              <SelectValue placeholder="Chọn quận/huyện" />
            </SelectTrigger>
            <SelectContent>
              {districts.map((district) => (
                <SelectItem
                  key={district.district_id}
                  value={district.district_name}
                >
                  {district.district_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="ward">Phường/Xã</Label>
          <Select
            value={address.ward}
            onValueChange={handleWardChange}
            disabled={!address.district}
          >
            <SelectTrigger>
              <SelectValue placeholder="Chọn phường/xã" />
            </SelectTrigger>
            <SelectContent>
              {wards.map((ward) => (
                <SelectItem key={ward.ward_id} value={ward.ward_name}>
                  {ward.ward_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="otherDetails">Địa chỉ cụ thể</Label>
          <Input
            id="otherDetails"
            name="otherDetails"
            value={address.otherDetails}
            onChange={handleChange}
            placeholder="Số nhà, tên đường, tòa nhà, ..."
          />
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="isDefault"
            checked={address.isDefault}
            onCheckedChange={handleCheckboxChange}
            className="data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500"
          />
          <Label
            htmlFor="isDefault"
            className="text-sm font-normal cursor-pointer"
          >
            Đặt làm địa chỉ mặc định
          </Label>
        </div>
      </div>
    </>
  );

  // Render as Sheet on mobile
  if (isMobile) {
    return (
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent side="bottom" className="h-[90vh] overflow-y-auto">
          <SheetHeader>
            <SheetTitle>
              {isEditing ? "Cập nhật địa chỉ" : "Thêm địa chỉ mới"}
            </SheetTitle>
          </SheetHeader>

          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            {formContent}

            <SheetFooter className="mt-6">
              <Button
                type="submit"
                className="w-full bg-green-500 hover:bg-green-600"
              >
                {isEditing ? "Cập nhật" : "Thêm địa chỉ"}
              </Button>
            </SheetFooter>
          </form>
        </SheetContent>
      </Sheet>
    );
  }

  // Render as Dialog on desktop
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] p-0">
        <DialogHeader className="px-4 py-2.5">
          <DialogTitle>
            {isEditing ? "Cập nhật địa chỉ" : "Thêm địa chỉ mới"}
          </DialogTitle>
          <DialogDescription>Nhập thông tin địa chỉ của bạn.</DialogDescription>
        </DialogHeader>

        <form className="max-h-[calc(100vh-300px)] overflow-auto p-4 md:max-h-[calc(100vh-180px)] md:px-6 md:pt-0">
          {formContent}
        </form>

        <DialogFooter className="px-4 py-2.5">
          <Button type="button" variant="outline" onClick={onClose}>
            Quay lại
          </Button>

          <Button
            className="border-green-400 shadow-none text-white hover:bg-green-600 bg-green-500 border"
            onClick={handleSubmit}
          >
            {isEditing ? "Cập nhật" : "Thêm địa chỉ"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default MobileAddressForm;
