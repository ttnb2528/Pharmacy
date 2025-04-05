import { useState, useContext, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { PharmacyContext } from "@/context/Pharmacy.context.jsx";
import { apiClient } from "@/lib/api-client.js";
import { ADD_ADDRESS_ROUTE, UPDATE_ADDRESS_ROUTE } from "@/API/index.api.js";
import { toast } from "sonner";
import { MapPin, ChevronRight } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import AddressForm from "@/pages/component/AddAddressForm.jsx";
import EditAddressForm from "@/pages/component/EditAddressForm.jsx";
import Loading from "@/pages/component/Loading.jsx";

const MobileCheckoutAddress = ({ selectedAddress, setSelectedAddress }) => {
  const { addressData, setAddressData } = useContext(PharmacyContext);
  const [isOpen, setIsOpen] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [tempSelectedAddress, setTempSelectedAddress] = useState(null);
  const [addresses, setAddresses] = useState([]);

  const [newAddress, setNewAddress] = useState({
    name: "",
    phone: "",
    province: "",
    district: "",
    ward: "",
    provinceId: "",
    districtId: "",
    wardId: "",
    otherDetails: "",
    isDefault: false,
  });

  useEffect(() => {
    if (isOpen) {
      setTempSelectedAddress(selectedAddress);
    }
  }, [isOpen, selectedAddress]);

  useEffect(() => {
    if (addressData && addressData.length > 0) {
      setAddresses(addressData);
      if (!selectedAddress) {
        const defaultAddress = addressData.find((address) => address.isDefault);
        if (defaultAddress) {
          setSelectedAddress(defaultAddress);
        }
      }
    }
  }, [addressData, selectedAddress, setSelectedAddress]);

  const handleAddressSelect = (address) => {
    setTempSelectedAddress(address);
  };

  const applySelectedAddress = () => {
    if (tempSelectedAddress) {
      setSelectedAddress(tempSelectedAddress);
      setIsOpen(false);
    }
  };

  const handleEditAddress = (address) => {
    setIsOpen(false);
    setIsEditing(true);
    setNewAddress(address);
    setSelectedAddressId(address._id);
  };

  const handleAddress = async (e) => {
    e.preventDefault();

    if (isEditing) {
      try {
        setIsLoading(true);
        const res = await apiClient.put(
          `${UPDATE_ADDRESS_ROUTE}/${selectedAddressId}`,
          {
            ...newAddress,
          }
        );

        if (res.status === 200 && res.data.status === 200) {
          setAddressData(
            addressData.map((address) =>
              address._id === selectedAddressId ? newAddress : address
            )
          );
          setSelectedAddress(newAddress);
          setIsOpen(false);
          toast.success(res.data.message);
        } else {
          toast.error(res.data.message);
        }
      } catch (error) {
        console.log(error);
        toast.error("Có lỗi xảy ra khi cập nhật địa chỉ");
      } finally {
        setIsLoading(false);
      }
    } else {
      try {
        setIsLoading(true);
        const res = await apiClient.post(ADD_ADDRESS_ROUTE, {
          ...newAddress,
        });

        if (res.status === 200 && res.data.status === 201) {
          setAddressData([...addressData, res.data.data]);
          setSelectedAddress(res.data.data);
          setIsOpen(false);
          toast.success(res.data.message);
        } else {
          toast.error(res.data.message);
        }
      } catch (error) {
        console.log(error);
        toast.error("Có lỗi xảy ra khi thêm địa chỉ");
      } finally {
        setIsLoading(false);
      }
    }

    setNewAddress({
      name: "",
      phone: "",
      otherDetails: "",
      ward: "",
      wardId: null,
      district: "",
      districtId: null,
      province: "",
      provinceId: null,
      isDefault: false,
    });

    setIsAddOpen(false);
    setIsEditing(false);
  };

  return (
    <div className="bg-white p-4 rounded-md">
      {isLoading && <Loading />}

      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <MapPin className="h-5 w-5 text-green-600" />
          <h2 className="font-semibold">Địa chỉ giao hàng</h2>
        </div>

        <Button
          variant="ghost"
          size="sm"
          className="text-green-600 p-0 h-auto flex items-center"
          onClick={() => setIsOpen(true)}
        >
          {selectedAddress ? "Thay đổi" : "Chọn địa chỉ"}
          <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </div>

      {selectedAddress ? (
        <div className="mt-3">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-medium">{selectedAddress.name}</span>
            <span className="text-gray-500">|</span>
            <span>{selectedAddress.phone}</span>
          </div>
          <p className="text-sm text-gray-600">
            {`${selectedAddress.otherDetails}, ${selectedAddress.ward}, ${selectedAddress.district}, ${selectedAddress.province}`}
          </p>
          {selectedAddress.isDefault && (
            <span className="inline-block mt-1 text-xs bg-green-50 text-green-600 px-2 py-0.5 rounded">
              Mặc định
            </span>
          )}
        </div>
      ) : (
        <p className="text-sm text-gray-500 mt-2">
          Vui lòng chọn địa chỉ giao hàng
        </p>
      )}

      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent side="bottom" className="h-[80vh]">
          <SheetHeader>
            <SheetTitle>Chọn địa chỉ giao hàng</SheetTitle>
          </SheetHeader>

          <div className="py-4 overflow-auto h-[calc(100%-120px)]">
            {addresses.length > 0 ? (
              <RadioGroup
                defaultValue={selectedAddress?._id}
                value={tempSelectedAddress?._id}
                onValueChange={(value) =>
                  handleAddressSelect(addresses.find((a) => a._id === value))
                }
              >
                {addresses.map((address) => (
                  <div className="space-y-4 mb-4" key={address._id}>
                    <div className="flex items-start space-x-2">
                      <RadioGroupItem
                        className="border-green-500 text-green-500 focus:ring-green-500 data-[state=checked]:bg-green-500 data-[state=checked]:text-white mt-1"
                        value={address._id}
                        id={`address-${address._id}`}
                      />
                      <div className="flex-1">
                        <Label
                          htmlFor={`address-${address._id}`}
                          className="flex justify-between w-full"
                        >
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium">
                                {address.name}
                              </span>
                              <span className="text-gray-500">|</span>
                              <span>{address.phone}</span>
                            </div>
                            <div className="text-sm text-gray-600 mt-1">
                              {`${address.otherDetails}, ${address.ward}, ${address.district}, ${address.province}`}
                            </div>
                            {address.isDefault && (
                              <span className="inline-block mt-1 text-xs bg-green-50 text-green-600 px-2 py-0.5 rounded">
                                Mặc định
                              </span>
                            )}
                          </div>

                          <Button
                            className="text-green-500 font-normal h-auto p-0"
                            variant="ghost"
                            onClick={() => handleEditAddress(address)}
                          >
                            Sửa
                          </Button>
                        </Label>
                      </div>
                    </div>
                    <Separator />
                  </div>
                ))}
              </RadioGroup>
            ) : (
              <p className="text-center text-gray-500">
                Không có địa chỉ nào. Vui lòng thêm địa chỉ mới.
              </p>
            )}

            <Button
              className="w-full mt-4 border-green-500 text-green-500 hover:bg-green-500 hover:text-white"
              variant="outline"
              onClick={() => {
                setIsOpen(false);
                setIsAddOpen(true);
              }}
            >
              + Thêm địa chỉ mới
            </Button>
          </div>

          <SheetFooter className="border-t pt-4">
            <Button
              className="w-full bg-green-500 hover:bg-green-600"
              onClick={applySelectedAddress}
              disabled={!tempSelectedAddress}
            >
              Xác nhận
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      {isAddOpen && (
        <AddressForm
          open={isAddOpen}
          address={newAddress}
          setAddress={setNewAddress}
          handleSubmit={handleAddress}
          onClose={() => {
            setIsAddOpen(false);
            setIsOpen(true);
          }}
        />
      )}

      {isEditing && (
        <EditAddressForm
          open={isEditing}
          onClose={() => {
            setIsEditing(false);
            setIsAddOpen(false);
            setIsOpen(true);
          }}
          address={newAddress}
          setAddress={setNewAddress}
          handleSubmit={handleAddress}
        />
      )}
    </div>
  );
};

export default MobileCheckoutAddress;
