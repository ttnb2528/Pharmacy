import {
  REMOVE_IMAGE_ROUTE,
  UPDATE_SLIDER_BANNER_ROUTE,
} from "@/API/index.api.js";
import { Button } from "@/components/ui/button.jsx";
import { Input } from "@/components/ui/input.jsx";
import { Label } from "@/components/ui/label.jsx";
import { Textarea } from "@/components/ui/textarea.jsx";
import { SliderBannerContext } from "@/context/SliderBannerContext.jsx";
import { apiClient } from "@/lib/api-admin.js";
import Loading from "@/pages/component/Loading.jsx";
import { useContext, useEffect, useState } from "react";
import { FaTrash } from "react-icons/fa";
import { toast } from "sonner";

const EditSliderForm = ({ slider, handleCancel }) => {
  const { setSliders } = useContext(SliderBannerContext);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    position: slider.position,
    description: slider.description,
    image: slider.image,
  });

  const [imageHover, setImageHover] = useState(false);
  const [newImageFile, setNewImageFile] = useState(null); // File ảnh mới
  const [previewImage, setPreviewImage] = useState(slider.image); // Preview ảnh

  useEffect(() => {
    // Cleanup URL khi component unmount hoặc khi previewImage thay đổi
    return () => {
      if (previewImage && newImageFile) {
        URL.revokeObjectURL(previewImage);
      }
    };
  }, [previewImage]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (newImageFile && previewImage) {
        URL.revokeObjectURL(previewImage); // Cleanup preview cũ nếu có
      }
      setNewImageFile(file);
      setPreviewImage(URL.createObjectURL(file));
      setFormData((prev) => ({
        ...prev,
        image: file, // Lưu file vào formData
      }));
    }
  };

  const handleDeleteImage = () => {
    if (newImageFile && previewImage) {
      URL.revokeObjectURL(previewImage); // Cleanup preview
    }
    setNewImageFile(null);
    setPreviewImage(null);
    setFormData((prev) => ({
      ...prev,
      image: "", // Xóa ảnh khỏi formData
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (!previewImage) {
        toast.error("Vui lòng thêm một ảnh cho slider!");
        setIsLoading(false);
        return;
      }

      let imageUrl = formData.image;

      // Nếu có ảnh mới, upload lên Cloudinary
      if (newImageFile) {
        const uploadFormData = new FormData();
        uploadFormData.append("file", newImageFile);
        uploadFormData.append("upload_preset", "pharmacy_slider_banner");

        const res = await fetch(import.meta.env.VITE_CLOUDINARY_IMAGE_URL, {
          method: "POST",
          body: uploadFormData,
        });

        if (res.status === 200) {
          const data = await res.json();
          imageUrl = data.secure_url;
        } else {
          throw new Error("Upload ảnh thất bại");
        }
      }

      // Nếu có ảnh cũ và đã bị xóa, xóa trên Cloudinary
      if (slider.image && !newImageFile && !previewImage) {
        const parts = slider.image.split("/");
        const fileName = parts[parts.length - 1].split(".")[0];
        const folder = parts[parts.length - 2];
        const publicId = `${folder}/${fileName}`;

        await apiClient.post(REMOVE_IMAGE_ROUTE, { publicId });
      }

      // Cập nhật slider với dữ liệu mới
      const updatedFormData = {
        ...formData,
        image: imageUrl,
      };

      const res = await apiClient.put(
        `${UPDATE_SLIDER_BANNER_ROUTE}/${slider._id}`,
        updatedFormData
      );

      if (res.status === 200 && res.data.status === 200) {
        setSliders((prev) =>
          prev.map((item) => (item._id === slider._id ? res.data.data : item))
        );
        toast.success("Cập nhật slider thành công");
        handleCancel();
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Có lỗi xảy ra khi cập nhật slider");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <>
      {isLoading && <Loading />}
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <Label htmlFor="image">Hình ảnh</Label>
          <Input
            type="file"
            accept="image/*"
            id="image"
            name="image"
            onChange={handleImageChange}
          />
          {/* Render image */}
          {previewImage && (
            <div
              className="relative w-32 h-32 mt-2"
              onMouseEnter={() => setImageHover(true)}
              onMouseLeave={() => setImageHover(false)}
            >
              <img
                src={previewImage}
                alt="slider"
                className="w-32 h-32 object-cover rounded-md"
              />
              {imageHover && (
                <div
                  className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-md cursor-pointer"
                  onClick={handleDeleteImage}
                >
                  <FaTrash className="text-white text-xl" />
                </div>
              )}
            </div>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="position">Vị trí</Label>
          <div className="flex gap-4">
            <div className="flex items-center">
              <input
                type="radio"
                id="position-left"
                name="position"
                value="left"
                checked={formData.position === "left"}
                onChange={handleInputChange}
                className="mr-2 h-4 w-4"
              />
              <Label htmlFor="position-left" className="cursor-pointer">
                Trái
              </Label>
            </div>
            <div className="flex items-center">
              <input
                type="radio"
                id="position-right"
                name="position"
                value="right"
                checked={formData.position === "right"}
                onChange={handleInputChange}
                className="mr-2 h-4 w-4"
              />
              <Label htmlFor="position-right" className="cursor-pointer">
                Phải
              </Label>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Mô tả</Label>
          <Textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Nhập mô tả"
            className="min-h-[120px] w-full"
          />
        </div>

        <div className="flex justify-end space-x-2">
          <Button type="submit">Lưu</Button>
          <Button type="button" variant="outline" onClick={handleCancel}>
            Hủy
          </Button>
        </div>
      </form>
    </>
  );
};

export default EditSliderForm;
