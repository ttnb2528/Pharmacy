import { useContext, useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { apiClient } from "@/lib/api-admin";
import Loading from "@/pages/component/Loading";
import {
  CREATE_BATCH_ROUTE,
  GET_ALL_MANUFACTURES_ROUTE,
  GET_ALL_SUPPLIERS_ROUTE,
} from "@/API/index.api.js";
import { MedicineContext } from "@/context/ProductContext.context.jsx";

const ImportMedicineForm = ({ medicine, handleCancel }) => {
  const { setMedicines } = useContext(MedicineContext);
  const [isLoading, setIsLoading] = useState(false);
  const [suppliers, setSuppliers] = useState([]);
  const [manufacturers, setManufacturers] = useState([]);
  const [formData, setFormData] = useState({
    MedicineId: medicine._id,
    batchNumber: "",
    dateOfEntry: "",
    dateOfManufacture: "",
    expiryDate: "",
    quantity: 0,
    price: 0,
    retailPrice: 0,
    SupplierId: "",
    ManufactureId: "",
  });

  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const res = await apiClient.get(GET_ALL_SUPPLIERS_ROUTE);

        if (res.status === 200 && res.data.status === 200) {
          setSuppliers(res.data.data);
        }
      } catch (error) {
        console.log(error);
      }
    };

    const fetchManufacturers = async () => {
      try {
        const res = await apiClient.get(GET_ALL_MANUFACTURES_ROUTE);

        if (res.status === 200 && res.data.status === 200) {
          setManufacturers(res.data.data);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchSuppliers();
    fetchManufacturers();
  }, []);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const res = await apiClient.post(CREATE_BATCH_ROUTE, formData);

      if (res.status === 200 && res.data.status === 201) {
        setMedicines((prevMedicines) =>
          prevMedicines.map((item) => {
            if (item._id === medicine._id) {
              return {
                ...item,
                quantityStock: item.quantityStock + Number(formData.quantity),
              };
            }
            return item;
          })
        );
        toast.success(res.data.message);
        handleCancel();
      } else {
        toast.error(res.data.message);
      }
      console.log(res);
    } catch (error) {
      console.log(error);
      toast.error("Có lỗi xảy ra khi nhập kho");
    } finally {
      setIsLoading(false);
    }
  };

  const renderField = (label, field, type = "text") => (
    <div className="grid grid-cols-4 items-center gap-4">
      <Label htmlFor={field} className="text-right">
        {label}
      </Label>
      <Input
        id={field}
        type={type}
        value={formData[field]}
        onChange={(e) => handleInputChange(field, e.target.value)}
        className="col-span-3"
      />
    </div>
  );

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 w-full max-h-[calc(100vh-120px)] h-fit overflow-y-auto p-1"
    >
      {isLoading && <Loading />}
      {renderField("Mã lô", "batchNumber")}
      {renderField("Ngày nhập", "dateOfEntry", "date")}
      {renderField("Ngày sản xuất", "dateOfManufacture", "date")}
      {renderField("Hạn sử dụng", "expiryDate", "date")}
      {renderField("Số lượng", "quantity", "number")}
      {renderField("Giá bán sỉ", "price", "number")}
      {renderField("Giá bán lẻ", "retailPrice", "number")}

      <div className="grid grid-cols-4 items-center gap-4">
        <Label className="text-right">Nhà cung cấp</Label>
        <Select
          value={formData.SupplierId}
          onValueChange={(value) => handleInputChange("SupplierId", value)}
        >
          <SelectTrigger className="col-span-3">
            <SelectValue placeholder="Chọn nhà cung cấp" />
          </SelectTrigger>
          <SelectContent>
            {suppliers.map((supplier) => (
              <SelectItem key={supplier._id} value={supplier._id}>
                {supplier.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-4 items-center gap-4">
        <Label className="text-right">Nhà sản xuất</Label>
        <Select
          value={formData.ManufactureId}
          onValueChange={(value) => handleInputChange("ManufactureId", value)}
        >
          <SelectTrigger className="col-span-3">
            <SelectValue placeholder="Chọn nhà sản xuất" />
          </SelectTrigger>
          <SelectContent>
            {manufacturers.map((manufacturer) => (
              <SelectItem key={manufacturer._id} value={manufacturer._id}>
                {manufacturer.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="submit">Lưu</Button>
        <Button type="button" variant="outline" onClick={handleCancel}>
          Hủy
        </Button>
      </div>
    </form>
  );
};

export default ImportMedicineForm;
