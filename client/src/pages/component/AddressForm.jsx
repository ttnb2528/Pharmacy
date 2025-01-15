// AddressForm.jsx
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button.jsx";
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
  SelectGroup,
  SelectItem,
  SelectValue,
  SelectTrigger,
} from "@/components/ui/select";
import { useEffect, useState } from "react";
import { apiClient } from "@/lib/api-client.js";
import {
  GET_DISTRICTS_ROUTE,
  GET_PROVINCES_ROUTE,
  GET_WARDS_ROUTE,
} from "@/API/index.api.js";

const AddressForm = ({
  open,
  onClose,
  address,
  setAddress,
  handleSubmit,
  isEditing,
}) => {
  // Fetch Location api
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);

  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const res = await apiClient.get(GET_PROVINCES_ROUTE);

        if (res.status === 200 && res.data.status === 200) {
          setProvinces(res.data.data);
        } else {
          setProvinces([]);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchProvinces();
  }, []);

  const handleProvinceChange = async (province) => {
    setAddress((prev) => ({
      ...prev,
      provinceCityId: province.province_id,
      provinceCity: province.province_name,
      districtId: null,
      district: "",
      wardId: null,
      ward: "",
    }));
    try {
      console.log(province.province_id);

      const res = await apiClient.get(
        `${GET_DISTRICTS_ROUTE}/${province.province_id}`
      );
      if (res.status === 200 && res.data.status === 200) {
        setDistricts(res.data.data);
      } else {
        setDistricts([]);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDistrictChange = async (district) => {
    setAddress((prev) => ({
      ...prev,
      districtId: district.district_id,
      district: district.district_name,
      wardId: null,
      ward: "",
    }));
    try {
      const res = await apiClient.get(
        `${GET_WARDS_ROUTE}/${district.district_id}`
      );
      if (res.status === 200 && res.data.status === 200) {
        setWards(res.data.data);
      } else {
        setWards([]);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleWardChange = (ward) => {
    setAddress((prev) => ({
      ...prev,
      wardId: ward.ward_id,
      ward: ward.ward_name,
    }));
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setAddress((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] p-0">
        <DialogHeader className="px-4 py-2.5">
          <DialogTitle>
            {isEditing ? "Cập nhật địa chỉ" : "Thêm địa chỉ mới"}
          </DialogTitle>
          <DialogDescription>
            Nhập thông tin địa chỉ mới của bạn.
          </DialogDescription>
        </DialogHeader>
        <form className="max-h-[calc(100vh-300px)] overflow-auto p-4 md:max-h-[calc(100vh-180px)] md:px-6 md:pt-0 ">
          {/* ... (form input) */}

          <div className="grid gap-4 py-4">
            <div className="grid items-center gap-4">
              <Label htmlFor="name">Họ tên</Label>
              <Input
                id="name"
                name="name"
                value={address.name}
                onChange={handleAddressChange}
              />
            </div>
            <div className="grid items-center gap-4">
              <Label htmlFor="phone">Số điện thoại</Label>
              <Input
                id="phone"
                name="phone"
                value={address.phone}
                onChange={handleAddressChange}
              />
            </div>

            <Label>Địa chỉ</Label>
            <div>
              <Select
                value={address.provinceCity}
                onValueChange={(value) => {
                  const selectedProvince = provinces.find(
                    (p) => p.province_name === value
                  );
                  handleProvinceChange(selectedProvince);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn Tỉnh/Thành phố" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {provinces.map((province) => (
                      <SelectItem
                        key={province.province_id}
                        value={province.province_name}
                      >
                        {province.province_name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Select
                value={address.district}
                onValueChange={(value) => {
                  const selectedDistrict = districts.find(
                    (d) => d.district_name === value
                  );
                  handleDistrictChange(selectedDistrict);
                }}
                disabled={!address.provinceCity}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn Quận/Huyện" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {districts.map((district) => (
                      <SelectItem
                        key={district.district_id}
                        value={district.district_name}
                      >
                        {district.district_name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Select
                value={address.ward}
                onValueChange={(value) => {
                  const selectedWard = wards.find((w) => w.ward_name === value);
                  handleWardChange(selectedWard);
                }}
                disabled={!address.district}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn Phường/Xã" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {wards.map((ward) => (
                      <SelectItem key={ward.ward_id} value={ward.ward_name}>
                        {ward.ward_name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Input
                id="otherDetails"
                name="otherDetails"
                placeholder="Số nhà, tên đường"
                value={address.otherDetails}
                onChange={handleAddressChange}
              />
            </div>

            <div className="mt-5">
              <Label className="inline-flex">
                <Input
                  type="checkbox"
                  name="isDefault"
                  className="w-5 h-5"
                  value={address.isDefault}
                  onChange={(e) =>
                    setAddress((prev) => ({
                      ...prev,
                      isDefault: e.target.checked,
                    }))
                  }
                />
                <span className="ml-2">Đặt làm địa chỉ mặc định</span>
              </Label>
            </div>
          </div>
        </form>

        <DialogFooter className="px-4 py-2.5">
          <Button type="button" variant="outline" onClick={onClose}>
            Quay lại
          </Button>

          {isEditing ? (
            <Button
              type="submit"
              className="border-green-400 shadow-none text-white hover:bg-green-600 bg-green-500 border"
            >
              Cập nhật địa chỉ
            </Button>
          ) : (
            <Button
              className="border-green-400 shadow-none text-white hover:bg-green-600 bg-green-500 border"
              onClick={handleSubmit}
            >
              Thêm địa chỉ
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddressForm;
