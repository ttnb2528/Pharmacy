import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
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
// import { Textarea } from "@/components/ui/textarea";
import { useContext, useEffect, useState } from "react";
import AddressForm from "@/pages/component/AddAddressForm.jsx";
import { PharmacyContext } from "@/context/Pharmacy.context.jsx";
import slugify from "slugify";
import { convertVND } from "@/utils/ConvertVND.js";
import { CalculateProductWithSale } from "@/utils/Calculate.js";
import { apiClient } from "@/lib/api-client.js";
import { ADD_ADDRESS_ROUTE, UPDATE_ADDRESS_ROUTE } from "@/API/index.api.js";
import { toast } from "sonner";
import EditAddressForm from "@/pages/component/EditAddressForm.jsx";
import Loading from "@/pages/component/Loading.jsx";
import { FaCcPaypal } from "react-icons/fa";
import { IoIosCash } from "react-icons/io";

const CheckoutInfo = ({
  paymentMethod,
  setPaymentMethod,
  selectedAddress,
  setSelectedAddress,
  note,
  setNote,
}) => {
  const { cart, allProducts, addressData, setAddressData } =
    useContext(PharmacyContext);

  const navigate = useNavigate();

  const [isSelectOpen, setIsSelectOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  // const [selectedAddress, setSelectedAddress] = useState(null);
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

  const [tempSelectedAddress, setTempSelectedAddress] = useState(null);

  useEffect(() => {
    if (isSelectOpen) {
      setTempSelectedAddress(selectedAddress);
    }
  }, [isSelectOpen]);

  useEffect(() => {
    if (addressData && addressData.length > 0) {
      setAddresses(addressData);
      // Nếu chưa có địa chỉ được chọn, tìm địa chỉ mặc định
      if (!selectedAddress) {
        const defaultAddress = addressData.find((address) => address.isDefault);
        if (defaultAddress) {
          setSelectedAddress(defaultAddress);
        }
      }
    }
  }, [addressData]);

  const handleAddressSelect = (address) => {
    setTempSelectedAddress(address);
  };

  const applySelectedAddress = () => {
    if (tempSelectedAddress) {
      setSelectedAddress(tempSelectedAddress);
      setIsSelectOpen(false);
    }
  };

  const handleEditAddress = (address) => {
    setIsSelectOpen(false);
    setIsEditing(true);
    setNewAddress(address);
    setSelectedAddressId(address._id);
  };

  const handleAddress = async (e) => {
    e.preventDefault();

    if (isEditing) {
      // Chế độ sửa
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
          setIsSelectOpen(false);
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
      // Chế độ thêm
      try {
        setIsLoading(true);
        const res = await apiClient.post(ADD_ADDRESS_ROUTE, {
          ...newAddress,
        });

        if (res.status === 200 && res.data.status === 201) {
          setAddressData([...addressData, res.data.data]);
          setSelectedAddress(res.data.data);
          setIsSelectOpen(false);

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

  const handleRouteToProduct = (product) => {
    navigate(
      `/${slugify(product?.categoryId?.name, { lower: true })}/${slugify(
        product?.name,
        { lower: true }
      )}`,
      { state: { product } }
    );
  };

  return (
    <div className="contents content-start gap-4 rounded-sm md:grid">
      {isLoading && <Loading />}
      <div className="order-2 grid content-start gap-6 rounded-sm bg-white p-4 md:order-1 md:p-6">
        <p className="hidden text-2xl font-bold text-neutral-900 md:block">
          Thanh toán
        </p>
        <div className="grid gap-4">
          {allProducts.map(
            (product, index) =>
              cart[product.id] > 0 && (
                <div key={product._id}>
                  <div className="grid grid-flow-col py-2">
                    <div className="grid grid-cols-[calc(68rem/16)_1fr] items-start gap-2">
                      <div className="relative h-[calc(68rem/16)] w-[calc(68rem/16)] rounded-sm border border-neutral-100">
                        <img
                          src={product.images[0]}
                          alt=""
                          onClick={() => handleRouteToProduct(product)}
                        />
                      </div>

                      <div className="flex flex-col justify-between md:flex-row md:space-x-4">
                        <div className="grid flex-1 gap-1">
                          <p
                            className="text-sm font-semibold text-neutral-900 line-clamp-2"
                            onClick={() => handleRouteToProduct(product)}
                          >
                            {product?.name}
                          </p>
                          <p className="text-sm text-neutral-700">
                            {product?.unit}
                          </p>
                          <div className="flex flex-wrap gap-1">
                            <div className="flex max-w-fit items-center space-x-1 rounded-sm bg-orange-200 px-1">
                              {product?.isDiscount && (
                                <p
                                  title="Deal Hot Giảm 25%"
                                  className="line-clamp-1 text-sm font-semibold text-orange-600"
                                >
                                  Deal Hot Giảm {product?.discountPercentage}%
                                </p>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-row-reverse items-center justify-between md:flex-row md:justify-center md:space-x-4">
                          <div className="flex w-[calc(117rem/16)] items-center justify-end md:justify-center">
                            <p className="text-base leading-4 text-neutral-900 md:text-sm">
                              x{cart[product.id]}
                            </p>
                          </div>
                        </div>

                        <div className="flex flex-col justify-center md:w-[calc(160rem/16)] md:flex-row md:items-center md:justify-end md:space-x-1">
                          {product?.isDiscount && (
                            <p className="text-base text-neutral-700 line-through md:text-sm">
                              {convertVND(product?.batches[0]?.price)}
                            </p>
                          )}
                          <p className="text-base font-semibold text-neutral-900 md:text-sm">
                            {product?.isDiscount
                              ? convertVND(
                                  CalculateProductWithSale(
                                    product?.batches[0].price,
                                    product?.discountPercentage
                                  )
                                )
                              : convertVND(product?.batches[0]?.price)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  {index < allProducts.length - 1 && <Separator />}
                </div>
              )
          )}
        </div>

        <div className="flex items-center space-x-6 space-y-0">
          <Label htmlFor="note">Ghi chú</Label>
          <div className="flex-1">
            <div className="relative flex">
              <Input
                id="note"
                placeholder="Nhập ghi chú vào đây"
                className="h-12"
                value={note}
                onChange={(e) => setNote(e.target.value)}
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
                              {`${selectedAddress.otherDetails}, ${selectedAddress.ward}, ${selectedAddress.district}, ${selectedAddress.province}`}
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
                        <Button variant="none" className="text-green-500">
                          Thay đổi
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                          <DialogTitle>Chọn địa chỉ</DialogTitle>
                          <DialogDescription></DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          {addresses.length > 0 ? (
                            <>
                              <RadioGroup
                                defaultValue={selectedAddress?._id}
                                value={tempSelectedAddress?._id}
                                onValueChange={(value) =>
                                  handleAddressSelect(
                                    addresses.find((a) => a._id === value)
                                  )
                                }
                              >
                                {addresses.map((address) => (
                                  <div className="space-y-5" key={address._id}>
                                    <div className="flex items-center space-x-2 space-y-4">
                                      <RadioGroupItem
                                        className="border-green-500 text-green-500 focus:ring-green-500 data-[state=checked]:bg-green-500 data-[state=checked]:text-white"
                                        value={address._id}
                                        id={`address-${address._id}`}
                                      />
                                      <div className="flex items-start space-x-2">
                                        <div className="flex-1">
                                          <Label
                                            htmlFor={`address-${address._id}`}
                                            className="flex-1"
                                          >
                                            <div>
                                              {address.name} - {address.phone}
                                            </div>
                                            <div className="text-sm text-gray-500">
                                              {`${address.otherDetails}, ${address.ward}, ${address.district}, ${address.province}`}
                                            </div>
                                          </Label>
                                        </div>

                                        <Button
                                          className="text-green-500 font-normal"
                                          variant="none"
                                          onClick={() =>
                                            handleEditAddress(address)
                                          }
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
                            <>
                              <p>
                                Không có địa chỉ nào. Vui lòng thêm địa chỉ mới.
                              </p>

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
                            disabled={!(addresses.length > 0)}
                            variant="outline"
                            className="border-green-400 shadow-none text-green-500 hover:bg-green-600 hover:text-white"
                          >
                            Áp dụng
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>

                    {isAddOpen && (
                      <AddressForm
                        open={isAddOpen}
                        address={newAddress}
                        setAddress={setNewAddress}
                        handleSubmit={handleAddress}
                        onClose={() => {
                          setIsAddOpen(false);
                          setIsSelectOpen(true);
                        }}
                      />
                    )}

                    {isEditing && (
                      <EditAddressForm
                        open={isEditing}
                        onClose={() => {
                          setIsEditing(false);
                          setIsAddOpen(false);
                          setIsSelectOpen(true);
                        }}
                        address={newAddress}
                        setAddress={setNewAddress}
                        handleSubmit={handleAddress}
                      />
                    )}
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
                        {convertVND(30000)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="order-5 rounded-sm bg-white pb-3 md:pb-0">
        <div className="container p-4 md:p-6">
          <h4 className="text-base font-semibold mb-4">
            Phương thức thanh toán
          </h4>
          <RadioGroup
            defaultValue="COD"
            value={paymentMethod}
            onValueChange={(value) => setPaymentMethod(value)}
          >
            <div className="flex items-center space-x-4 space-y-0">
              <RadioGroupItem value="COD" id="COD" />
              <Label htmlFor="COD" className="flex items-center space-x-4">
                <IoIosCash className="w-8 h-8 text-green-600" />
                <span>Thanh toán khi nhận hàng (COD)</span>
              </Label>
            </div>
            <div className="flex items-center space-x-4 space-y-0 mt-2">
              <RadioGroupItem value="online" id="online" />
              <Label htmlFor="online" className="flex items-center space-x-4">
                <FaCcPaypal className="w-8 h-8 text-blue-600" />
                <span>PayPal</span>
              </Label>
            </div>
          </RadioGroup>
        </div>
      </div>
    </div>
  );
};

export default CheckoutInfo;
