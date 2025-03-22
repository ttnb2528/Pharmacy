import { useContext, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { apiClient } from "@/lib/api-admin.js";
import {
  CREATE_SLIDER_BANNER_ROUTE,
  UPDATE_IMAGE_SLIDER_BANNER_ROUTE,
} from "@/API/index.api.js";
import { toast } from "sonner";
import Loading from "@/pages/component/Loading.jsx";
import { FaTrash } from "react-icons/fa";
import { SliderBannerContext } from "@/context/SliderBannerContext.jsx";

const AddAdminSliderBannerForm = ({ handleCancel }) => {
  const { setSliders } = useContext(SliderBannerContext);

  const [isLoading, setIsLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [avatarHover, setAvatarHover] = useState(null);

  const [formData, setFormData] = useState({
    images: null,
    position: "",
    description: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (imageFile) {
        setIsLoading(true);
        const res = await apiClient.post(CREATE_SLIDER_BANNER_ROUTE, formData);
        console.log("create slider banner response: ", res);

        if (res.status === 200 && res.data.status === 201) {
          const formData = new FormData();
          formData.append("file", imageFile);
          formData.append("upload_preset", "pharmacy_slider_banner");

          const res1 = await fetch(import.meta.env.VITE_CLOUDINARY_IMAGE_URL, {
            method: "POST",
            body: formData,
          });

          console.log("upload image response: ", res1);

          if (res1.status === 200) {
            const data = await res1.json();

            const updateData = { ...formData, image: data.secure_url };

            const res2 = await apiClient.put(
              `${UPDATE_IMAGE_SLIDER_BANNER_ROUTE}/${res.data.data._id}`,
              {
                image: updateData.image,
              }
            );
            console.log("update image slider banner response: ", res2);

            if (res2.status === 200 && res2.data.status === 200) {
              toast.success("Thêm slide banner thành công");
              setSliders((prev) => [...prev, res2.data.data]);
              handleCancel();
            } else {
              toast.error(res2.data.message);
            }
          }
        } else {
          toast.error(res.data.message);
        }
      } else {
        toast.error("Vui lòng chọn ảnh");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteImage = () => {
    setImageFile(null);

    const fileInput = document.getElementById("image");
    if (fileInput) {
      fileInput.value = "";
    }
  };

  return (
    <>
      {isLoading && <Loading />}
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <Label htmlFor="name">Hình ảnh</Label>
          <Input
            type="file"
            accept="image/*"
            id="image"
            name="image"
            onChange={handleImageChange}
          />
          {/* render image */}
          {imageFile && (
            <div
              className="relative w-fit h-32"
              onMouseEnter={() => {
                setAvatarHover(true);
              }}
              onMouseLeave={() => {
                setAvatarHover(false);
              }}
            >
              <img
                src={URL.createObjectURL(imageFile)}
                alt="slider"
                className="mt-2 w-auto h-32 object-cover"
              />
              {avatarHover && (
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

        <div className="flex justify-end">
          <Button type="submit">Thêm mới</Button>
        </div>
      </form>
    </>
  );
};

export default AddAdminSliderBannerForm;
