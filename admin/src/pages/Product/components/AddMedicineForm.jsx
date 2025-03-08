import { useState, useContext } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { FaTrash } from "react-icons/fa";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MedicineContext } from "@/context/ProductContext.context";
import { apiClient } from "@/lib/api-admin";
import {
  ADD_MEDICINE_ROUTE,
  UPDATE_IMAGES_MEDICINE_ROUTE,
} from "@/API/index.api";
import Loading from "@/pages/component/Loading";

const AddMedicineForm = ({ handleCancel }) => {
  const { categories, brands, setMedicines } = useContext(MedicineContext);
  const [isLoading, setIsLoading] = useState(false);
  const [imageFiles, setImageFiles] = useState([]);
  const [avatarHover, setAvatarHover] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    dosage: "",
    unit: "",
    instruction: "",
    description: "",
    uses: "",
    packaging: "",
    effect: "",
    drugUser: "",
    ingredient: "",
    isRx: false,
    isDiscount: false,
    discountPercentage: 0,
    categoryId: "",
    brandId: "",
    images: [],
  });

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImageFiles((prev) => [...prev, ...files]);
  };

  const handleDeleteImage = (index) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));

    const fileInput = document.getElementById("images");
    if (fileInput && fileInput.files) {
      const dataTransfer = new DataTransfer();

      Array.from(fileInput.files)
        .filter((_, i) => i !== index)
        .forEach((file) => dataTransfer.items.add(file));

      fileInput.files = dataTransfer.files;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (imageFiles.length > 0) {
        setIsLoading(true);
        const res = await apiClient.post(ADD_MEDICINE_ROUTE, formData);

        if (res.status === 200 && res.data.status === 201) {
          const uploadPromises = imageFiles.map(async (file) => {
            const formData = new FormData();
            formData.append("file", file);
            formData.append("upload_preset", "pharmacy_avatar");

            const res = await fetch(import.meta.env.VITE_CLOUDINARY_IMAGE_URL, {
              method: "POST",
              body: formData,
            });

            if (res.status === 200) {
              const data = await res.json();
              return data.secure_url;
            }
          });

          const imageUrls = await Promise.all(uploadPromises);
          const updatedFormData = { ...formData, images: imageUrls };

          const res1 = await apiClient.put(
            `${UPDATE_IMAGES_MEDICINE_ROUTE}/${res.data.data._id}`,
            {
              images: updatedFormData.images,
            }
          );

          if (res1.status === 200 && res1.data.status === 200) {
            toast.success("Thêm thuốc thành công");
            setMedicines((prev) => [...prev, res1.data.data]);
            handleCancel();
          } else {
            toast.error(res1.data.message);
          }
        } else {
          toast.error(res.data.message);
        }
      } else {
        toast.error("Vui lòng chọn hình ảnh");
      }
    } catch (error) {
      console.log(error);
      toast.error("Có lỗi xảy ra khi thêm thuốc");
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

  const renderTextArea = (label, field) => (
    <div className="grid grid-cols-4 items-center gap-4">
      <Label htmlFor={field} className="text-right">
        {label}
      </Label>
      <Textarea
        id={field}
        value={formData[field]}
        onChange={(e) => handleInputChange(field, e.target.value)}
        className="col-span-3"
      />
    </div>
  );

  const renderSwitch = (label, field) => (
    <div className="grid grid-cols-4 items-center gap-4">
      <Label htmlFor={field} className="text-right">
        {label}
      </Label>
      <div className="col-span-3">
        <Switch
          id={field}
          checked={formData[field]}
          onCheckedChange={(checked) => handleInputChange(field, checked)}
        />
      </div>
    </div>
  );

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 w-full max-h-[calc(100vh-120px)] h-fit overflow-y-auto py-1"
    >
      {isLoading && <Loading />}
      {renderField("Tên thuốc", "name")}
      {renderField("Liều lượng", "dosage")}
      {renderField("Đơn vị", "unit")}
      {renderTextArea("Hướng dẫn sử dụng", "instruction")}
      {renderTextArea("Mô tả", "description")}
      {renderTextArea("Công dụng", "uses")}
      {renderTextArea("Thành phần", "ingredient")}
      {renderField("Đóng gói", "packaging")}
      {renderTextArea("Tác dụng phụ", "effect")}
      {renderField("Đối tượng sử dụng", "drugUser")}
      {renderSwitch("Kê đơn", "isRx")}
      {renderSwitch("Giảm giá", "isDiscount")}

      {formData.isDiscount && (
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="discountPercentage" className="text-right">
            Phần trăm giảm giá
          </Label>
          <Input
            id="discountPercentage"
            type="number"
            min="0"
            max="100"
            value={formData.discountPercentage}
            onChange={(e) =>
              handleInputChange(
                "discountPercentage",
                Number.parseInt(e.target.value)
              )
            }
            className="col-span-3"
          />
        </div>
      )}

      <div className="grid grid-cols-4 items-center gap-4">
        <Label className="text-right">Danh mục</Label>
        <Select
          value={formData.categoryId}
          onValueChange={(value) => handleInputChange("categoryId", value)}
        >
          <SelectTrigger className="col-span-3">
            <SelectValue placeholder="Chọn danh mục" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category._id} value={category._id}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-4 items-center gap-4">
        <Label className="text-right">Thương hiệu</Label>
        <Select
          value={formData.brandId}
          onValueChange={(value) => handleInputChange("brandId", value)}
        >
          <SelectTrigger className="col-span-3">
            <SelectValue placeholder="Chọn thương hiệu" />
          </SelectTrigger>
          <SelectContent>
            {brands.map((brand) => (
              <SelectItem key={brand._id} value={brand._id}>
                {brand.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-4 items-center gap-4">
        <Label className="text-right">Hình ảnh</Label>
        <div className="col-span-3">
          <div className="flex flex-wrap gap-2 mb-2">
            {imageFiles.map((image, index) => (
              <div
                key={index}
                className="relative"
                onMouseEnter={() => {
                  const newHover = [...avatarHover];
                  newHover[index] = true;
                  setAvatarHover(newHover);
                }}
                onMouseLeave={() => {
                  const newHover = [...avatarHover];
                  newHover[index] = false;
                  setAvatarHover(newHover);
                }}
              >
                <img
                  src={URL.createObjectURL(image) || "/placeholder.svg"}
                  alt={`Preview ${index + 1}`}
                  className="w-24 h-24 object-cover rounded-md"
                />
                {avatarHover[index] && (
                  <div
                    className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-md cursor-pointer"
                    onClick={() => handleDeleteImage(index)}
                  >
                    <FaTrash className="text-white text-xl" />
                  </div>
                )}
              </div>
            ))}
          </div>
          <Input
            id="images"
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageChange}
          />
        </div>
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

export default AddMedicineForm;
