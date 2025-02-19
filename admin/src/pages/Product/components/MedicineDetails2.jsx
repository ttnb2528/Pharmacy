import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Check, X } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { MedicineContext } from "@/context/ProductContext.context.jsx";
import { Input } from "@/components/ui/input";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { apiClient } from "@/lib/api-admin.js";
import {
  ADD_MEDICINE_ROUTE,
  GET_ALL_BATCHES_FOR_MEDICINE_ROUTE,
  // REMOVE_IMAGE_ROUTE,
  UPDATE_IMAGES_MEDICINE_ROUTE,
  UPDATE_MEDICINE_ROUTE,
  //   REMOVE_IMAGE_ROUTE,
} from "@/API/index.api.js";
import { toast } from "sonner";

import { FaTrash } from "react-icons/fa";
import Loading from "@/pages/component/Loading.jsx";

const MedicineDetails = ({
  medicine,
  isEditing,
  isAdding,
  isImport,
  handleCancel,
}) => {
  const [activeTab, setActiveTab] = useState("info");
  const { categories, brands, setMedicines } = useContext(MedicineContext);
  const [batches, setBatches] = useState([]);
  const [imageFiles, setImageFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [newImageFiles, setNewImageFiles] = useState();

  // Thêm state để quản lý form
  const [formData, setFormData] = useState({
    name: medicine?.name || "",
    dosage: medicine?.dosage || "",
    unit: medicine?.unit || "",
    instruction: medicine?.instruction || "",
    uses: medicine?.uses || "",
    description: medicine?.description || "",
    packaging: medicine?.packaging || "",
    effect: medicine?.effect || "",
    drugUser: medicine?.drugUser || "",
    isRx: medicine?.isRx || false,
    isDiscount: medicine?.isDiscount || false,
    percentDiscount: medicine?.percentDiscount || 0,
    categoryId: medicine?.categoryId?._id || "",
    brandId: medicine?.brandId?._id || "",
    images: medicine?.images || [],
  });

  const [avatarHover, setAvatarHover] = useState(
    Array(formData.images.length).fill(false)
  );

  // Handler để cập nhật form
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

  const renderField = (label, field, id, type = "text") => (
    <div className="grid grid-cols-4 items-center gap-4">
      <Label htmlFor={id}>{label}</Label>
      {isEditing || isAdding ? (
        <Input
          id={id}
          type={type}
          value={formData[field]}
          onChange={(e) => handleInputChange(field, e.target.value)}
          className="col-span-3"
        />
      ) : (
        <p className="col-span-3">{medicine?.[field]}</p>
      )}
    </div>
  );

  const renderTextArea = (label, field, id) => (
    <div className="grid grid-cols-4 items-center gap-4">
      <Label htmlFor={id}>{label}</Label>
      {isEditing || isAdding ? (
        <Textarea
          id={id}
          value={formData[field]}
          onChange={(e) => handleInputChange(field, e.target.value)}
          className="col-span-3"
        />
      ) : (
        <p className="col-span-3">{medicine?.[field]}</p>
      )}
    </div>
  );

  const renderBoolean = (label, field, id) => (
    <div className="grid grid-cols-4 items-center gap-4">
      <Label htmlFor={id}>{label}</Label>
      {isEditing || isAdding ? (
        <div className="col-span-3">
          <Switch
            id={id}
            checked={formData[field]}
            onCheckedChange={(checked) => handleInputChange(field, checked)}
          />
        </div>
      ) : (
        <div className="col-span-3">
          {medicine?.[field] ? (
            <Check className="text-green-500" />
          ) : (
            <X className="text-red-500" />
          )}
        </div>
      )}
    </div>
  );

  useEffect(() => {
    const renderBatchesHistory = async (medicine) => {
      try {
        const res = await apiClient.get(
          `${GET_ALL_BATCHES_FOR_MEDICINE_ROUTE}/${medicine._id}`
        );

        if (res.status === 200 && res.data.status === 200) {
          setBatches(res.data.data);
        } else {
          console.log(res.data.message);
        }
      } catch (error) {
        console.log(error);
      }
    };

    if (!isEditing) {
      renderBatchesHistory(medicine);
    }
  }, [isEditing, medicine]);

  // const handleDeleteImageEdit1 = async (index) => {
  //   try {
  //     const parts = formData.images[index].split("/");
  //     let fileName = parts[parts.length - 1].split(".")[0]; // Loại bỏ phần mở rộng .jpg
  //     let folder = parts[parts.length - 2];
  //     let publicId = folder + "/" + fileName;
  //     // console.log(publicId);

  //     const res = await apiClient.post(REMOVE_IMAGE_ROUTE, {
  //       publicId,
  //     });

  //     if (res.status === 200 && res.data.status === 200) {
  //       const newImages = formData.images.filter((_, i) => i !== index);
  //       setFormData((prev) => ({ ...prev, images: newImages }));
  //       toast.success("Xóa hình ảnh thành công");
  //     } else {
  //       toast.error(res.data.message);
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  const handleDeleteImageEdit = async (index) => {
    setFormData((prev) => {
      const newImages = prev.images.filter((_, i) => i !== index);
      return { ...prev, images: newImages };
    });

    const fileInput = document.getElementById("images");
    if (fileInput && fileInput.files) {
      const dataTransfer = new DataTransfer();

      Array.from(fileInput.files)
        .filter((_, i) => i !== index)
        .forEach((file) => dataTransfer.items.add(file));

      fileInput.files = dataTransfer.files;
    }
  };

  const handleImageChangeEdit = (e) => {
    const files = Array.from(e.target.files);
    setNewImageFiles(files);
    const URLFiles = files.map((file) => URL.createObjectURL(file));
    setFormData((prev) => ({ ...prev, images: [...prev.images, ...URLFiles] }));
  };

  const handleSubmitAdd = async () => {
    // Xử lý submit form với formData
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
          formData.images = imageUrls;

          const res1 = await apiClient.put(
            `${UPDATE_IMAGES_MEDICINE_ROUTE}/${res.data.data._id}`,
            { images: formData.images }
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
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitEdit = async (medicine) => {
    try {
      if (formData.images.length > 0) {
        setIsLoading(true);
        const res = await apiClient.put(
          `${UPDATE_MEDICINE_ROUTE}/${medicine._id}`,
          formData
        );
        console.log(res);

        if (res.status === 200 && res.data.status === 200) {
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

          const imageUrls = await Promise.all(uploadPromises);
          formData.images = [...formData.images, ...imageUrls];

          const res1 = await apiClient.put(
            `${UPDATE_IMAGES_MEDICINE_ROUTE}/${res.data.data._id}`,
            { images: formData.images }
          );

          if (res1.status === 200 && res1.data.status === 200) {
            toast.success("Cập nhật thuốc thành công");
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
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Tabs
      value={activeTab}
      onValueChange={setActiveTab}
      className="w-full max-h-[calc(100vh-120px)] h-fit overflow-y-auto"
    >
      {isLoading && <Loading />}
      <TabsList>
        <TabsTrigger value="info">Thông tin thuốc</TabsTrigger>
        {isImport && <TabsTrigger value="batch">Nhập thuốc</TabsTrigger>}
        {!isEditing && !isAdding && !isImport && (
          <TabsTrigger value="history">Lịch sử nhập</TabsTrigger>
        )}
      </TabsList>
      <TabsContent value="info" className="overflow-auto">
        <div className="grid gap-4 py-4">
          {renderField("Tên thuốc", "name", "name")}
          {renderField("Liều lượng", "dosage", "dosage")}
          {renderField("Đơn vị", "unit", "unit")}
          {renderTextArea("Hướng dẫn sử dụng", "instruction", "instruction")}
          {renderTextArea("Mô tả", "description", "description")}
          {renderTextArea("Công dụng", "uses", "uses")}
          {renderField("Đóng gói", "packaging", "packaging")}
          {renderTextArea("Tác dụng phụ", "effect", "effect")}
          {renderField("Đối tượng sử dụng", "drugUser", "drugUser")}
          {renderBoolean("Kê đơn", "isRx", "isRx")}
          {renderBoolean("Giảm giá", "isDiscount", "isDiscount")}

          {(isEditing || isAdding
            ? formData.isDiscount
            : medicine?.isDiscount) &&
            renderField(
              "Phần trăm giảm giá",
              "percentDiscount",
              "percentDiscount",
              "number"
            )}

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="category">Danh mục</Label>
            {isEditing || isAdding ? (
              <Select
                value={formData.categoryId}
                onValueChange={(value) =>
                  handleInputChange("categoryId", value)
                }
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
            ) : (
              <p className="col-span-3">{medicine?.categoryId?.name}</p>
            )}
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="brand">Thương hiệu</Label>
            {isEditing || isAdding ? (
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
            ) : (
              <p className="col-span-3">{medicine?.brandId?.name}</p>
            )}
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="images">Hình ảnh</Label>
            <div className="col-span-3">
              {isAdding &&
                imageFiles.map((image, index) => (
                  <div
                    key={index}
                    className="relative inline-block mr-2 mb-2"
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
                      src={
                        typeof image === "string"
                          ? image || "/placeholder.svg"
                          : URL.createObjectURL(image)
                      }
                      alt={`Product image ${index + 1}`}
                      className="w-24 h-24 object-cover rounded-md"
                    />
                    {avatarHover[index] && (
                      <div
                        className="absolute inset-0 top-1 flex items-center w-24 h-24 justify-center bg-black/50 rounded-md"
                        onClick={() => handleDeleteImage(index)}
                      >
                        <FaTrash className="text-white text-xl cursor-pointer" />
                      </div>
                    )}
                  </div>
                ))}

              {isEditing &&
                formData.images.map((image, index) => (
                  <div
                    key={index}
                    className="relative inline-block mr-2 mb-2"
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
                      alt={`Product image ${index + 1}`}
                      className="w-24 h-24 object-cover rounded-md"
                    />
                    {avatarHover[index] && (
                      <div
                        className="absolute inset-0 top-1 flex items-center w-24 h-24 justify-center bg-black/50 rounded-md"
                        onClick={() => handleDeleteImageEdit(index)}
                      >
                        <FaTrash className="text-white text-xl cursor-pointer" />
                      </div>
                    )}
                  </div>
                ))}

              {isAdding && (
                <Input
                  id="images"
                  type="file"
                  multiple
                  accept="image/*"
                  className="mt-2"
                  onChange={handleImageChange}
                />
              )}

              {isEditing && (
                <Input
                  id="images"
                  type="file"
                  multiple
                  accept="image/*"
                  className="mt-2"
                  onChange={handleImageChangeEdit}
                />
              )}
              {!isEditing && !isAdding && (
                <div className="flex space-x-2">
                  {medicine?.images.map((image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt={`Product image ${index + 1}`}
                      className="w-24 h-24 object-cover rounded-md"
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
        {(isEditing || isAdding || isImport) && (
          <div className="flex justify-end space-x-2">
            <Button
              onClick={
                isAdding ? handleSubmitAdd : () => handleSubmitEdit(medicine)
              }
            >
              Lưu
            </Button>
            <Button variant="outline" onClick={handleCancel}>
              Hủy
            </Button>
          </div>
        )}
      </TabsContent>
      {isEditing && isImport && (
        <TabsContent value="batch">
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="batchNumber">Số lô</Label>
              <Input id="batchNumber" className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="dateOfEntry">Ngày nhập</Label>
              <Input id="dateOfEntry" type="date" className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="expiryDate">Hạn sử dụng</Label>
              <Input id="expiryDate" type="date" className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="quantity">Số lượng</Label>
              <Input id="quantity" type="number" className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="price">Giá nhập</Label>
              <Input id="price" type="number" className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="retailPrice">Giá bán</Label>
              <Input id="retailPrice" type="number" className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="supplier">Nhà cung cấp</Label>
              <Select>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Chọn nhà cung cấp" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="supplier1">Nhà cung cấp 1</SelectItem>
                  <SelectItem value="supplier2">Nhà cung cấp 2</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="manufacturer">Nhà sản xuất</Label>
              <Select>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Chọn nhà sản xuất" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="manufacturer1">Nhà sản xuất 1</SelectItem>
                  <SelectItem value="manufacturer2">Nhà sản xuất 2</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <Button>Lưu</Button>
            <Button variant="outline" onClick={handleCancel}>
              Hủy
            </Button>
          </div>
        </TabsContent>
      )}

      {!isEditing && (
        <TabsContent value="history">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Số lô</TableHead>
                  <TableHead>Ngày nhập</TableHead>
                  <TableHead>Ngày sản xuất</TableHead>
                  <TableHead>Hạn sử dụng</TableHead>
                  <TableHead>Số lượng</TableHead>
                  <TableHead>Giá nhập</TableHead>
                  <TableHead>Giá bán</TableHead>
                  <TableHead>Nhà cung cấp</TableHead>
                  <TableHead>Nhà sản xuất</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {batches.map((batch) => (
                  <TableRow key={batch._id}>
                    <TableCell>{batch.batchNumber}</TableCell>
                    <TableCell>
                      {new Date(batch.dateOfEntry).toLocaleDateString("vi")}
                    </TableCell>
                    <TableCell>
                      {new Date(batch.dateOfManufacture).toLocaleDateString(
                        "vi"
                      )}
                    </TableCell>
                    <TableCell>
                      {new Date(batch.expiryDate).toLocaleDateString("vi")}
                    </TableCell>
                    <TableCell>{batch.quantity}</TableCell>
                    <TableCell>{batch.price}</TableCell>
                    <TableCell>{batch.retailPrice}</TableCell>
                    <TableCell>{batch.SupplierId.name}</TableCell>
                    <TableCell>{batch.ManufactureId.name}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      )}
    </Tabs>
  );
};

export default MedicineDetails;
