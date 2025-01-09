import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import { Separator } from "@/components/ui/separator.jsx";
import { Button } from "@/components/ui/button.jsx";
import { CiCirclePlus } from "react-icons/ci";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useState } from "react";

const CheckoutInfo = () => {
  const allProducts = [1, 2, 3];
  const [isSelectOpen, setIsSelectOpen] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [addresses, setAddresses] = useState([
    {
      id: 1,
      name: "Dương Thiên Tấn",
      phone: "0866554764",
      street: "123",
      ward: "Phường Cái Khế",
      district: "Quận Ninh Kiều",
      city: "Thành phố Cần Thơ",
      isDefault: true,
    },
    {
      id: 2,
      name: "Nguyễn Văn A",
      phone: "0123456789",
      street: "456",
      ward: "Phường An Cư",
      district: "Quận Ninh Kiều",
      city: "Thành phố Cần Thơ",
      isDefault: false,
    },
  ]);

  const [newAddress, setNewAddress] = useState({
    name: "",
    phone: "",
    street: "",
    ward: "",
    district: "",
    city: "",
    isDefault: false,
  });
  const [tempSelectedAddress, setTempSelectedAddress] = useState(null);

  useEffect(() => {
    const defaultAddress = addresses.find((address) => address.isDefault);
    if (defaultAddress) {
      setSelectedAddress(defaultAddress);
    }
  }, []);

  const handleAddressSelect = (address) => {
    setTempSelectedAddress(address);
  };

  const applySelectedAddress = () => {
    if (tempSelectedAddress) {
      setSelectedAddress(tempSelectedAddress);
      setIsSelectOpen(false);
    }
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setNewAddress((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddAddress = (e) => {
    e.preventDefault();
    const newId =
      addresses.length > 0 ? Math.max(...addresses.map((a) => a.id)) + 1 : 1;
    const newAddressWithId = { ...newAddress, id: newId };
    setAddresses((prev) => [...prev, newAddressWithId]);
    setSelectedAddress(newAddressWithId);
    setIsAddOpen(false);
    setNewAddress({
      name: "",
      phone: "",
      street: "",
      ward: "",
      district: "",
      city: "",
      isDefault: false,
    });
  };

  return (
    <div className="contents content-start gap-4 rounded-sm md:grid">
      <div className="order-2 grid content-start gap-6 rounded-sm bg-white p-4 md:order-1 md:p-6">
        <p className="hidden text-2xl font-bold text-neutral-900 md:block">
          Thanh toán
        </p>
        <div className="grid gap-4">
          {allProducts.map((product, index) => (
            <>
              <div key={index} className="grid grid-flow-col">
                <div className="grid grid-cols-[calc(68rem/16)_1fr] items-start gap-2">
                  <div className="relative h-[calc(68rem/16)] w-[calc(68rem/16)] rounded-sm border border-neutral-100">
                    img
                  </div>

                  <div className="flex flex-col justify-between md:flex-row md:space-x-4">
                    <div className="grid flex-1 gap-1">
                      <p className="text-sm font-semibold text-neutral-900 line-clamp-2">
                        <Link to={"/product/123"}>
                          Combo trắng răng Eucryl Bạc Hà
                        </Link>
                      </p>
                      <p className="text-sm text-neutral-700">Bộ</p>
                      <div className="flex flex-wrap gap-1">
                        <div className="flex max-w-fit items-center space-x-1 rounded-sm bg-orange-200 px-1">
                          <p
                            title="Deal Hot Giảm 25%"
                            className="line-clamp-1 text-sm font-semibold text-orange-600"
                          >
                            Deal Hot Giảm 25%
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-row-reverse items-center justify-between md:flex-row md:justify-center md:space-x-4">
                      <div className="flex w-[calc(117rem/16)] items-center justify-end md:justify-center">
                        <p className="text-base leading-4 text-neutral-900 md:text-sm">
                          x1
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col justify-center md:w-[calc(160rem/16)] md:flex-row md:items-center md:justify-end md:space-x-1">
                      <p className="text-base text-neutral-700 line-through md:text-sm">
                        150.000&nbsp;₫
                      </p>
                      <p className="text-base font-semibold text-neutral-900 md:text-sm">
                        112.500&nbsp;₫
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <Separator />
            </>
          ))}
        </div>

        <div className="flex items-center space-x-6 space-y-0">
          <Label htmlFor="note">Ghi chú</Label>
          <div className="flex-1">
            <div className="relative flex">
              <Input
                id="note"
                placeholder="Nhập ghi chú vào đây"
                className="h-12"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="order-1 rounded-sm bg-white pb-4 md:order-2 md:pb-0">
        <div className="container p-4 md:p-6">
          <div>
            <div className="block-title hidden pb-4 !text-base md:flex md:px-0">
              <h4 className="text-[16px] font-semibold leading-[24px] flex flex-1">
                Giao hàng tận nơi
              </h4>
            </div>

            <div className="space-y-2">
              <div className="text-sm">
                {/* address */}
                <div>
                  <div className="flex items-start">
                    <div className="flex-1 space-y-2">
                      <span className="text-base font-semibold md:text-sm">
                        Thông tin người nhận
                      </span>
                      {selectedAddress && (
                        <div className="grid gap-2">
                          <div className="grid grid-flow-col content-center items-center justify-start gap-2">
                            <span className="break-word line-clamp-1 font-normal">
                              {selectedAddress.name}
                            </span>
                            <span className="hidden h-5 w-[1px] bg-neutral-300 md:inline-flex"></span>
                            <span>{selectedAddress.phone}</span>
                          </div>

                          <div className="items-center justify-start space-y-2 ">
                            <span className="break-word mb-1 block flex-1">
                              {`${selectedAddress.street}, ${selectedAddress.ward}, ${selectedAddress.district}, ${selectedAddress.city}`}
                            </span>
                            {selectedAddress.isDefault && (
                              <span className="rounded-sm px-1 py-[2px] text-xs font-medium text-green-500 bg-green-50">
                                Mặc định
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    <Dialog open={isSelectOpen} onOpenChange={setIsSelectOpen}>
                      <DialogTrigger asChild>
                        <Button variant="none" className="text-green-500">Thay đổi</Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                          <DialogTitle>Chọn địa chỉ</DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          {addresses.length > 0 ? (
                            <>
                              <RadioGroup
                                value={tempSelectedAddress?.id.toString()}
                                onValueChange={(value) =>
                                  handleAddressSelect(
                                    addresses.find(
                                      (a) => a.id.toString() === value
                                    )
                                  )
                                }
                              >
                                {addresses.map((address) => (
                                  <div className="space-y-5" key={address.id}>
                                    <div className="flex items-center space-x-2 space-y-4">
                                      <RadioGroupItem
                                        className="border-green-500 text-green-500 focus:ring-green-500 data-[state=checked]:bg-green-500 data-[state=checked]:text-white"
                                        value={address.id.toString()}
                                        id={`address-${address.id}`}
                                      />
                                      <div className="flex items-start space-x-2">
                                        <div className="flex-1">
                                          <Label
                                            htmlFor={`address-${address.id}`}
                                            className="flex-1"
                                          >
                                            <div>
                                              {address.name} - {address.phone}
                                            </div>
                                            <div className="text-sm text-gray-500">
                                              {`${address.street}, ${address.ward}, ${address.district}, ${address.city}`}
                                            </div>
                                          </Label>
                                        </div>

                                        <Button
                                          className="text-green-500 font-normal"
                                          variant="none"
                                          onClick={() => setIsAddOpen(true)}
                                        >
                                          Cập nhật
                                        </Button>
                                      </div>
                                    </div>
                                    <Separator />
                                  </div>
                                ))}
                              </RadioGroup>

                              <Button
                                className="w-1/3 border-green-400 shadow-none text-green-500 hover:bg-green-600 hover:text-white"
                                variant="outline"
                                onClick={() => {
                                  setIsSelectOpen(false);
                                  setIsAddOpen(true);
                                }}
                              >
                                <CiCirclePlus
                                  style={{ width: "20px", height: "20px" }}
                                />
                                Thêm địa chỉ
                              </Button>
                            </>
                          ) : (
                            <p>
                              Không có địa chỉ nào. Vui lòng thêm địa chỉ mới.
                            </p>
                          )}
                        </div>
                        <DialogFooter>
                          <Button
                            variant="outline"
                            onClick={() => setIsSelectOpen(false)}
                          >
                            Quay lại
                          </Button>

                          <Button
                            onClick={applySelectedAddress}
                            variant="outline"
                            className="border-green-400 shadow-none text-green-500 hover:bg-green-600 hover:text-white"
                          >
                            Áp dụng
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>

                    <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                      <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                          <DialogTitle>Thêm địa chỉ mới</DialogTitle>
                          <DialogDescription>
                            Nhập thông tin địa chỉ mới của bạn.
                          </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleAddAddress}>
                          <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="name" className="text-right">
                                Họ tên
                              </Label>
                              <Input
                                id="name"
                                name="name"
                                value={newAddress.name}
                                onChange={handleAddressChange}
                                className="col-span-3"
                              />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="phone" className="text-right">
                                Số điện thoại
                              </Label>
                              <Input
                                id="phone"
                                name="phone"
                                value={newAddress.phone}
                                onChange={handleAddressChange}
                                className="col-span-3"
                              />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="street" className="text-right">
                                Địa chỉ
                              </Label>
                              <Textarea
                                id="street"
                                name="street"
                                value={newAddress.street}
                                onChange={handleAddressChange}
                                className="col-span-3"
                              />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="ward" className="text-right">
                                Phường/Xã
                              </Label>
                              <Input
                                id="ward"
                                name="ward"
                                value={newAddress.ward}
                                onChange={handleAddressChange}
                                className="col-span-3"
                              />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="district" className="text-right">
                                Quận/Huyện
                              </Label>
                              <Input
                                id="district"
                                name="district"
                                value={newAddress.district}
                                onChange={handleAddressChange}
                                className="col-span-3"
                              />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="city" className="text-right">
                                Thành phố
                              </Label>
                              <Input
                                id="city"
                                name="city"
                                value={newAddress.city}
                                onChange={handleAddressChange}
                                className="col-span-3"
                              />
                            </div>
                          </div>
                          <DialogFooter>
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => {
                                setIsAddOpen(false);
                                setIsSelectOpen(true);
                              }}
                            >
                              Quay lại
                            </Button>
                            <Button
                              type="submit"
                              className="border-green-400 shadow-none text-white hover:bg-green-600 bg-green-500 border"
                            >
                              Thêm địa chỉ
                            </Button>
                          </DialogFooter>
                        </form>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>

                <div className="my-4">
                  <Separator />
                </div>

                {/* Delivery */}
                <div className="space-y-2">
                  <div className="flex">
                    <div className="flex-1 space-y-2">
                      <span className="text-base font-semibold md:text-sm">
                        Đơn vị vận chuyển
                      </span>
                      <div className="flex items-center font-semibold">
                        Viettel Post
                      </div>
                    </div>

                    <div className="ml-2">
                      <p className="text-end text-[14px] font-semibold leading-[20px]">
                        31.000&nbsp;₫
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutInfo;
