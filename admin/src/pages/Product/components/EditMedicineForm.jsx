import { useState, useContext, useEffect } from "react";
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
import { UPDATE_MEDICINE_ROUTE, REMOVE_IMAGE_ROUTE } from "@/API/index.api";
import Loading from "@/pages/component/Loading";

const EditMedicineForm = ({ medicine, handleCancel }) => {
  const { categories, brands, setMedicines } = useContext(MedicineContext);
  const [isLoading, setIsLoading] = useState(false);

  // const [newImageFiles, setNewImageFiles] = useState([]);
  const [avatarHover, setAvatarHover] = useState([]);

  const [existingImages, setExistingImages] = useState(medicine.images); // Ảnh có sẵn
  const [newImageFiles, setNewImageFiles] = useState([]); // File ảnh mới
  const [imagesToDelete, setImagesToDelete] = useState([]); // Ảnh cần xóa
  const [previewImages, setPreviewImages] = useState([]); // Preview ảnh mới

  const [formData, setFormData] = useState({
    name: medicine.name,
    dosage: medicine.dosage,
    unit: medicine.unit,
    instruction: medicine.instruction,
    description: medicine.description,
    uses: medicine.uses,
    packaging: medicine.packaging,
    effect: medicine.effect,
    drugUser: medicine.drugUser,
    ingredient: medicine.ingredient,
    isRx: medicine.isRx,
    isDiscount: medicine.isDiscount,
    percentDiscount: medicine.percentDiscount,
    categoryId: medicine?.categoryId._id,
    brandId: medicine?.brandId._id,
    images: medicine.images,
  });

  // useEffect(() => {
  //   setAvatarHover(Array(formData.images.length).fill(false));
  // }, [formData.images]);

  useEffect(() => {
    setAvatarHover(
      Array(existingImages.length + previewImages.length).fill(false)
    );
  }, [existingImages, previewImages]);

  // Xử lý khi thêm ảnh mới
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setNewImageFiles((prev) => [...prev, ...files]);

    // Tạo preview cho ảnh mới
    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setPreviewImages((prev) => [...prev, ...newPreviews]);
  };

  // Đánh dấu ảnh cần xóa (không xóa ngay)
  const handleMarkImageForDeletion = (index) => {
    if (index < existingImages.length) {
      // Ảnh có sẵn
      const imageUrl = existingImages[index];
      setImagesToDelete((prev) => [...prev, imageUrl]);
      setExistingImages((prev) => prev.filter((_, i) => i !== index));
    } else {
      // Ảnh preview mới
      const previewIndex = index - existingImages.length;
      URL.revokeObjectURL(previewImages[previewIndex]); // Cleanup preview URL
      setPreviewImages((prev) => prev.filter((_, i) => i !== previewIndex));
      setNewImageFiles((prev) => prev.filter((_, i) => i !== previewIndex));
    }
  };

  // Xử lý submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);

      // 1. Xóa ảnh trên cloud nếu có
      if (imagesToDelete.length > 0) {
        await Promise.all(
          imagesToDelete.map(async (imageUrl) => {
            const parts = imageUrl.split("/");
            const fileName = parts[parts.length - 1].split(".")[0];
            const folder = parts[parts.length - 2];
            const publicId = folder + "/" + fileName;

            await apiClient.post(REMOVE_IMAGE_ROUTE, { publicId });
          })
        );
      }

      // 2. Upload ảnh mới lên cloud nếu có
      let newImageUrls = [];
      if (newImageFiles.length > 0) {
        const uploadPromises = newImageFiles.map(async (file) => {
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

        newImageUrls = await Promise.all(uploadPromises);
      }

      // 3. Cập nhật thông tin thuốc với mảng ảnh mới
      const updatedFormData = {
        ...formData,
        images: [...existingImages, ...newImageUrls],
      };

      const res = await apiClient.put(
        `${UPDATE_MEDICINE_ROUTE}/${medicine._id}`,
        updatedFormData
      );

      if (res.status === 200 && res.data.status === 200) {
        setMedicines((prev) =>
          prev.map((item) => (item._id === medicine._id ? res.data.data : item))
        );
        toast.success("Cập nhật thuốc thành công");
        handleCancel();
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Có lỗi xảy ra khi cập nhật thuốc");
    } finally {
      setIsLoading(false);
    }
  };

  // Cleanup preview URLs khi unmount
  useEffect(() => {
    return () => {
      previewImages.forEach(URL.revokeObjectURL);
    };
  }, [previewImages]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // const handleImageChange = (e) => {
  //   const files = Array.from(e.target.files);
  //   setNewImageFiles((prev) => [...prev, ...files]);
  //   const newImageUrls = files.map((file) => URL.createObjectURL(file));
  //   setFormData((prev) => ({
  //     ...prev,
  //     images: [...prev.images, ...newImageUrls],
  //   }));
  // };

  // const handleDeleteImage = async (index) => {
  //   if (index < medicine.images.length) {
  //     // Existing image
  //     try {
  //       const parts = formData.images[index].split("/");
  //       const fileName = parts[parts.length - 1].split(".")[0];
  //       const folder = parts[parts.length - 2];
  //       const publicId = folder + "/" + fileName;

  //       const res = await apiClient.post(REMOVE_IMAGE_ROUTE, { publicId });

  //       if (res.status === 200 && res.data.status === 200) {
  //         setFormData((prev) => ({
  //           ...prev,
  //           images: prev.images.filter((_, i) => i !== index),
  //         }));
  //         toast.success("Xóa hình ảnh thành công");
  //       } else {
  //         toast.error(res.data.message);
  //       }
  //     } catch (error) {
  //       console.log(error);
  //       toast.error("Có lỗi xảy ra khi xóa hình ảnh");
  //     }
  //   } else {
  //     // New image
  //     const newIndex = index - medicine.images.length;
  //     setNewImageFiles((prev) => prev.filter((_, i) => i !== newIndex));
  //     setFormData((prev) => ({
  //       ...prev,
  //       images: prev.images.filter((_, i) => i !== index),
  //     }));
  //   }
  // };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   try {
  //     setIsLoading(true);
  //     const res = await apiClient.put(
  //       `${UPDATE_MEDICINE_ROUTE}/${medicine._id}`,
  //       formData
  //     );

  //     if (res.status === 200 && res.data.status === 200) {
  //       if (newImageFiles.length > 0) {
  //         const uploadPromises = newImageFiles.map(async (file) => {
  //           const formData = new FormData();
  //           formData.append("file", file);
  //           formData.append("upload_preset", "pharmacy_avatar");

  //           const res = await fetch(import.meta.env.VITE_CLOUDINARY_IMAGE_URL, {
  //             method: "POST",
  //             body: formData,
  //           });

  //           if (res.status === 200) {
  //             const data = await res.json();
  //             return data.secure_url;
  //           }
  //         });

  //         const newImageUrls = await Promise.all(uploadPromises);
  //         const updatedImages = [
  //           ...formData.images.filter((img) => !img.startsWith("blob:")),
  //           ...newImageUrls,
  //         ];

  //         const res1 = await apiClient.put(
  //           `${UPDATE_IMAGES_MEDICINE_ROUTE}/${medicine._id}`,
  //           { images: updatedImages }
  //         );

  //         if (res1.status === 200 && res1.data.status === 200) {
  //           setMedicines((prev) =>
  //             prev.map((item) =>
  //               item._id === medicine._id ? res1.data.data : item
  //             )
  //           );
  //           toast.success("Cập nhật thuốc thành công");
  //           handleCancel();
  //         } else {
  //           toast.error(res1.data.message);
  //         }
  //       } else {
  //         console.log("data: ", res.data);

  //         setMedicines((prev) =>
  //           prev.map((item) =>
  //             item._id === medicine._id ? res.data.data : item
  //           )
  //         );
  //         toast.success("Cập nhật thuốc thành công");
  //         handleCancel();
  //       }
  //     } else {
  //       toast.error(res.data.message);
  //     }
  //   } catch (error) {
  //     console.log(error);
  //     toast.error("Có lỗi xảy ra khi cập nhật thuốc");
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

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
      {renderField("Thành phần", "ingredient")}
      {renderField("Đóng gói", "packaging")}
      {renderTextArea("Tác dụng phụ", "effect")}
      {renderField("Đối tượng sử dụng", "drugUser")}
      {renderSwitch("Kê đơn", "isRx")}
      {renderSwitch("Giảm giá", "isDiscount")}

      {formData.isDiscount &&
        renderField("Phần trăm giảm giá", "percentDiscount", "number")}

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
            {/* {formData.images.map((image, index) => (
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
                  src={image || "/placeholder.svg"}
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
            ))} */}
            {existingImages.map((image, index) => (
              <div
                key={`existing-${index}`}
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
                  src={image}
                  alt={`Existing ${index + 1}`}
                  className="w-24 h-24 object-cover rounded-md"
                />
                {avatarHover[index] && (
                  <div
                    className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-md cursor-pointer"
                    onClick={() => handleMarkImageForDeletion(index)}
                  >
                    <FaTrash className="text-white text-xl" />
                  </div>
                )}
              </div>
            ))}

            {previewImages.map((preview, index) => (
              <div
                key={`preview-${index}`}
                className="relative"
                onMouseEnter={() => {
                  const newHover = [...avatarHover];
                  newHover[existingImages.length + index] = true;
                  setAvatarHover(newHover);
                }}
                onMouseLeave={() => {
                  const newHover = [...avatarHover];
                  newHover[existingImages.length + index] = false;
                  setAvatarHover(newHover);
                }}
              >
                <img
                  src={preview}
                  alt={`Preview ${index + 1}`}
                  className="w-24 h-24 object-cover rounded-md"
                />
                {avatarHover[existingImages.length + index] && (
                  <div
                    className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-md cursor-pointer"
                    onClick={() =>
                      handleMarkImageForDeletion(existingImages.length + index)
                    }
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

export default EditMedicineForm;
