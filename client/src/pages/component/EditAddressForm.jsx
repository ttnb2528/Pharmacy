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
import Loading from "./Loading.jsx";

const EditAddressForm = ({
  open,
  onClose,
  address,
  setAddress,
  handleSubmit,
}) => {
  // Fetch Location api
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        setIsLoading(true);
        const res = await apiClient.get(GET_PROVINCES_ROUTE);

        if (res.status === 200 && res.data.status === 200) {
          setProvinces(res.data.data);
        } else {
          setProvinces([]);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProvinces();
  }, []);

  useEffect(() => {
    if (address.province) {
      const fetchDistricts = async () => {
        try {
          setIsLoading(true);
          const res = await apiClient.get(
            `${GET_DISTRICTS_ROUTE}/${address.provinceId}`
          );
          console.log(address.provinceId);

          console.log(res);

          if (res.status === 200 && res.data.status === 200) {
            setDistricts(res.data.data);
          } else {
            setDistricts([]);
          }
        } catch (error) {
          console.error(error);
        } finally {
          setIsLoading(false);
        }
      };

      fetchDistricts();
    }
  }, [address.province, address.provinceId]);

  useEffect(() => {
    if (address.district) {
      const fetchWards = async () => {
        try {
          setIsLoading(true);
          const res = await apiClient.get(
            `${GET_WARDS_ROUTE}/${address.districtId}`
          );

          console.log(address.districtId);

          if (res.status === 200 && res.data.status === 200) {
            setWards(res.data.data);
          } else {
            setWards([]);
          }
        } catch (error) {
          console.error(error);
        } finally {
          setIsLoading(false);
        }
      };

      fetchWards();
    }
  }, [address.district, address.districtId]);

  const handleAddressChange = (name, value) => {
    setAddress((prev) => {
      const updatedAddress = { ...prev, [name]: value };

      // Reset district and ward when province changes
      if (name === "province") {
        updatedAddress.district = "";
        updatedAddress.districtId = null;
        updatedAddress.ward = "";
        updatedAddress.wardId = null;
      }

      // Reset ward when district changes
      if (name === "district") {
        updatedAddress.ward = "";
        updatedAddress.wardId = null;
      }

      return updatedAddress;
    });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      {isLoading && <Loading />}
      <DialogContent className="sm:max-w-[425px] p-0">
        <DialogHeader className="px-4 py-2.5">
          <DialogTitle>Cập nhật địa chỉ mới</DialogTitle>
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
                onChange={(e) => handleAddressChange("name", e.target.value)}
              />
            </div>
            <div className="grid items-center gap-4">
              <Label htmlFor="phone">Số điện thoại</Label>
              <Input
                id="phone"
                name="phone"
                value={address.phone}
                onChange={(e) => handleAddressChange("phone", e.target.value)}
              />
            </div>

            <Label>Địa chỉ</Label>
            <div>
              <Select
                value={address.province}
                onValueChange={(value) => {
                  const selectedProvince = provinces.find(
                    (province) => province.province_name === value
                  );
                  handleAddressChange("province", value);
                  handleAddressChange(
                    "provinceId",
                    selectedProvince?.province_id
                  );
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
                disabled={!address.province}
                onValueChange={(value) => {
                  const selectedDistrict = districts.find(
                    (district) => district.district_name === value
                  );
                  handleAddressChange("district", value);
                  handleAddressChange(
                    "districtId",
                    selectedDistrict?.district_id
                  );
                }}
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
                disabled={!address.district}
                onValueChange={(value) => {
                  const selectedWard = wards.find(
                    (ward) => ward.ward_name === value
                  );
                  handleAddressChange("ward", value);
                  handleAddressChange("wardId", selectedWard?.ward_id);
                }}
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
                onChange={(e) =>
                  handleAddressChange("otherDetails", e.target.value)
                }
              />
            </div>

            <div className="mt-5">
              <Label className="inline-flex">
                <Input
                  type="checkbox"
                  name="isDefault"
                  className="w-5 h-5"
                  checked={address.isDefault}
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

          <Button
            className="border-green-400 shadow-none text-white hover:bg-green-600 bg-green-500 border"
            onClick={handleSubmit}
          >
            Cập nhật địa chỉ
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditAddressForm;
