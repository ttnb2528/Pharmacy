// Component UI
import { ADD_ADDRESS_ROUTE, DELETE_ADDRESS_ROUTE } from "@/API/index.api.js";
import { Button } from "@/components/ui/button.jsx";
import { PharmacyContext } from "@/context/Pharmacy.context.jsx";
import { apiClient } from "@/lib/api-client.js";
import AddressForm from "@/pages/component/AddressForm.jsx";
import ConfirmForm from "@/pages/component/ConfirmForm.jsx";
import Loading from "@/pages/component/Loading.jsx";
import { useContext, useState } from "react";

// Icons
import { CiCirclePlus } from "react-icons/ci";
import { IoTrashOutline } from "react-icons/io5";
import { toast } from "sonner";

const Addresses = () => {
  const { addressData, setAddressData } = useContext(PharmacyContext);

  const [isLoading, setIsLoading] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState(null);
  const [newAddress, setNewAddress] = useState({
    name: "",
    phone: "",
    otherDetails: "",
    provinceCityId: null,
    provinceCity: "",
    districtId: null,
    district: "",
    wardId: null,
    ward: "",
    isDefault: false,
  });

  const [confirmDelete, setConfirmDelete] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  const handleAddAddress = async (e) => {
    e.preventDefault();

    if (isEditing) {
      // Chế độ sửa
      setAddressData((prevAddresses) =>
        prevAddresses.map((address) =>
          address._id === editingAddressId ? newAddress : address
        )
      );
      setIsEditing(false);
      setEditingAddressId(null);
    } else {
      // Chế độ thêm
      try {
        setIsLoading(true);
        const res = await apiClient.post(ADD_ADDRESS_ROUTE, {
          ...newAddress,
        });

        if (res.status === 200 && res.data.status === 201) {
          setAddressData((prev) => [...prev, res.data.data]);
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
      district: "",
      provinceCity: "",
      isDefault: false,
    });

    setIsAddOpen(false);
  };

  const handleEditAddress = (address) => {
    setIsEditing(true);
    setEditingAddressId(address._id);
    setNewAddress(address);
    setIsAddOpen(true);
  };

  const handleOpenAddDialog = () => {
    setNewAddress({
      name: "",
      phone: "",
      otherDetails: "",
      ward: "",
      district: "",
      provinceCity: "",
      isDefault: false,
    });
    setIsAddOpen(true);
  };

  const handleConfirmOpen = (address) => {
    setConfirmDelete(true);
    setConfirmDeleteId(address._id);
  };

  const handleDeleteAddress = async (addressId) => {
    try {
      setIsLoading(true);
      const res = await apiClient.delete(
        `${DELETE_ADDRESS_ROUTE}/${addressId}`
      );

      console.log(res);

      if (res.status === 200 && res.data.status === 200) {
        setAddressData((prev) =>
          prev.filter((address) => address._id !== addressId)
        );
        toast.success(res.data.message);
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Có lỗi xảy ra khi xóa địa chỉ");
    } finally {
      setIsLoading(false);
      setConfirmDelete(false);
    }
  };

  return (
    <div>
      {isLoading && <Loading />}
      <div className="items-center space-x-4 mb-4 hidden flex-row md:flex">
        <div className="flex-1">
          <h1 className="text-xl font-semibold text-neutral-900">
            Địa chỉ nhận hàng
          </h1>
        </div>
        <div>
          <Button
            className="bg-gray-100 text-green-500 shadow-none border-green-500 border hover:bg-gray-100 hover:border-green-400 hover:text-green-400"
            onClick={handleOpenAddDialog}
          >
            <CiCirclePlus />
            <span className="ml-1">Thêm địa chỉ</span>
          </Button>
        </div>
      </div>
      <div className="bg-white px-4 md:rounded-lg md:px-6  md:py-3">
        {/* child */}
        {addressData?.length === 0 ? (
          <div className="text-center text-neutral-500 py-3">
            Bạn chưa có địa chỉ nào. Hãy thêm địa chỉ mới.
          </div>
        ) : (
          addressData.map((address) => (
            <div
              key={address._id}
              className="border-b border-b-gray-300 bg-white py-3 last:border-0"
            >
              <div className="flex flex-1 items-start space-x-2">
                <div className="flex-1">
                  <div className="grid gap-2">
                    <div className="grid grid-flow-col content-center items-center justify-start gap-2">
                      <div className="break-word line-clamp-1 font-semibold">
                        {address?.name || "Khach Hang"}
                      </div>
                      <span className="hidden h-5 w-[1px] bg-gray-300 md:inline-flex"></span>
                      <span>{address?.phone}</span>
                    </div>

                    <div className="items-center justify-start space-y-2">
                      <span className="break-word mb-1 block flex-1">
                        {`${address?.otherDetails}, ${address?.ward}, ${address?.district}, ${address?.provinceCity}`}
                      </span>
                      <span className="mb-1 md:mr-2">
                        {address?.isDefault && (
                          <span className="rounded-sm px-1 py-[2px] text-xs font-medium text-green-600 bg-green-100">
                            mặc định
                          </span>
                        )}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center">
                  <Button
                    className="bg-transparent shadow-none text-green-500 hover:bg-transparent hover:text-green-700 px-2"
                    onClick={() => handleEditAddress(address)}
                  >
                    Cập nhật
                  </Button>
                  <Button
                    className="bg-transparent shadow-none text-neutral-900 hover:bg-transparent p-1"
                    onClick={() => handleConfirmOpen(address)}
                  >
                    <IoTrashOutline />
                  </Button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      <AddressForm
        open={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        address={newAddress}
        setAddress={setNewAddress}
        handleSubmit={handleAddAddress}
        isEditing={isEditing}
      />

      {/* Confirm delete dialog */}
      <ConfirmForm
        open={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        handleDeleteAddress={handleDeleteAddress}
        confirmDeleteId={confirmDeleteId}
      />
    </div>
  );
};

export default Addresses;
