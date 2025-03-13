import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
// import { PharmacyContext } from "@/context/Pharmacy.context.jsx";
import { apiClient } from "@/lib/api-client.js";
import Loading from "@/pages/component/Loading.jsx";

// UI Components
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button.jsx";
import { Input } from "@/components/ui/input.jsx";
import { Label } from "@/components/ui/label.jsx";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import VietnameseCalendar from "@/utils/vietnamese-calendar.jsx";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select.jsx";
import { toast } from "sonner";

// Icon
import { FaChevronRight, FaPlus, FaTrash } from "react-icons/fa";

// Router
import {
  ADD_PROFILE_IMAGE_ROUTE,
  REMOVE_PROFILE_IMAGE_ROUTE,
  UPDATE_USER_ROUTE,
} from "@/API/index.api.js";
import { normalizeWhitespace } from "@/utils/normalizeWhiteSpace.jsx";
import { getInitials } from "@/utils/getInitialName.jsx";
import { useAppStore } from "@/store/index.js";

const PersonalInfo = () => {
  const { userInfo, setUserInfo } = useAppStore();
  // const { updateUserData } = useContext(PharmacyContext);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const [date, setDate] = useState("");

  const fileInputRef = useRef(null);

  // Data state
  const [name, setName] = useState("Khach hang");
  const [gender, setGender] = useState("");
  const [phone, setPhone] = useState("");
  const [avatar, setAvatar] = useState("");

  const [hovered, setHovered] = useState(false);

  const [initialValues, setInitialValues] = useState({
    name: "",
    gender: "",
    phone: "",
    date: "",
  });

  useEffect(() => {
    if (userInfo) {
      setName(userInfo?.name || "Khach hang");
      setGender(userInfo?.gender || "");
      setPhone(userInfo?.phone || "");
      setDate(userInfo?.date || "");
    }

    if (userInfo?.avatar) {
      setAvatar(userInfo.avatar);
    }

    setInitialValues({
      name: userInfo?.name || "Khach hang",
      gender: userInfo?.gender || "",
      phone: userInfo?.phone || "",
      date: userInfo?.date || "",
    });
  }, [userInfo]);

  const handleFileInputClick = () => {
    fileInputRef.current.click();
  };

  const handleAvatarChange = async (e) => {
    setIsLoading(true);
    try {
      const file = e.target.files[0];

      if (file) {
        console.log(file);

        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", import.meta.env.VITE_PROFILE_PRESET);
        console.log(formData);

        const res = await fetch(import.meta.env.VITE_CLOUDINARY_IMAGE_URL, {
          method: "POST",
          body: formData,
        });

        console.log(res);

        if (res.status === 200) {
          const data = await res.json();

          const response = await apiClient.post(ADD_PROFILE_IMAGE_ROUTE, {
            avatar: data.secure_url,
          });

          console.log(response);

          if (response.status === 200 && response.data.status === 200) {
            toast.success("Ảnh đã được cập nhật");
            setUserInfo({ ...userInfo, avatar: data.secure_url });
          } else {
            toast.error("Có lỗi xảy ra, vui lòng thử lại sau");
          }
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteImage = async () => {
    setIsLoading(true);
    try {
      const res = await apiClient.delete(REMOVE_PROFILE_IMAGE_ROUTE);
      if (res.status === 200) {
        setUserInfo({ ...userInfo, avatar: null });
        toast.success("Ảnh đã được xóa");
        setAvatar(null);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const isDisabled = () => {
    // So sánh giá trị hiện tại với giá trị ban đầu
    return (
      name === initialValues.name &&
      phone === initialValues.phone &&
      gender === initialValues.gender &&
      date === initialValues.date
    );
  };

  const handleNormalize = () => {
    let updatedName = name;
    let updatedPhone = phone;

    if (name !== initialValues.name) {
      updatedName = normalizeWhitespace(name)[0];
    }

    if (phone !== initialValues.phone) {
      updatedPhone = normalizeWhitespace(phone)[0];
    }

    return { updatedName, updatedPhone };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { updatedName, updatedPhone } = handleNormalize();
    setIsLoading(true);
    try {
      const res = await apiClient.put(`${UPDATE_USER_ROUTE}/${userInfo._id}`, {
        name: updatedName,
        phone: updatedPhone,
        gender,
        date,
      });

      console.log(res);
      if (res.status === 200 || res.data.status === 200) {
        toast.success("Cập nhật thông tin thành công");
        setUserInfo({
          ...userInfo,
          name: updatedName,
          phone: updatedPhone,
          gender,
          date,
        });
      } else {
        toast.error("Có lỗi xảy ra, vui lòng thử lại sau");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      {isLoading && <Loading />}
      <div>
        <div className="items-center space-x-4 mb-4 hidden md:block">
          <div className="flex-1">
            <h1 className="text-xl font-semibold text-neutral-900">
              Thông tin cá nhân
            </h1>
          </div>
          <div></div>
        </div>

        <div>
          <div className="rounded-lg bg-white p-6">
            {/* set image */}
            <div className="mb-3">
              <span className="text-sm font-semibold text-neutral-900">
                Ảnh đại diện
              </span>
              <div
                className="mt-2 flex items-center gap-6 relative "
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
              >
                {/* logic set image */}
                <Avatar className="w-20 h-20">
                  {userInfo?.avatar ? (
                    <AvatarImage
                      src={avatar}
                      alt="User avatar"
                      className="object-cover w-full h-full bg-black"
                    />
                  ) : (
                    // <AvatarFallback className="border border-green-400 bg-green-400 text-white">
                    //   <span className="text-xl font-bold">
                    //     {userInfo?.name ? userInfo.name : "KH"}
                    //   </span>
                    // </AvatarFallback>

                    <div className="uppercase h-20 w-20 text-xl font-bold border border-green-400 bg-green-400 text-white flex items-center justify-center rounded-full ">
                      {userInfo?.name ? getInitials(userInfo.name) : "KH"}
                    </div>
                  )}
                </Avatar>
                {hovered && (
                  <div
                    className="absolute inset-0 top-1 flex items-center w-20 h-20 justify-center bg-black/50 ring-fuchsia-50 rounded-full"
                    onClick={
                      userInfo?.avatar
                        ? handleDeleteImage
                        : handleFileInputClick
                    }
                  >
                    {userInfo?.avatar ? (
                      <FaTrash className="text-white text-xl cursor-pointer" />
                    ) : (
                      <FaPlus className="text-white text-xl cursor-pointer" />
                    )}
                  </div>
                )}
                <div>
                  <div className="mb-2 flex">
                    <Button
                      className="bg-neutral-300 text-neutral-900 hover:bg-neutral-200"
                      onClick={handleFileInputClick}
                    >
                      <span>Cập nhật ảnh mới</span>
                    </Button>
                    <input
                      ref={fileInputRef}
                      id="picture"
                      className="hidden"
                      accept=".jpg, .jpeg, .png, .heic, .heif"
                      type="file"
                      onChange={handleAvatarChange}
                    ></input>
                  </div>
                  <div className="grid text-sm font-medium text-neutral-700">
                    <p>Dung lượng file tối đa 5 MB.</p>
                    <p>Định dạng: .JPEG, .PNG</p>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <form>
                <div className="grid grid-cols-2 gap-5">
                  <div className="col-span-1 grid gap-3">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Họ và tên</Label>
                      <Input
                        id="fullName"
                        placeholder="Họ và Tên"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="dob">Ngày Sinh</Label>
                      <div>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              id="dob"
                              variant={"outline"}
                              className={cn(
                                "justify-start text-left font-normal w-full",
                                !date && "text-muted-foreground"
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {date ? (
                                format(date, "dd/MM/yyyy", {
                                  locale: vi,
                                })
                              ) : (
                                <span>Ngày sinh</span>
                              )}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <VietnameseCalendar
                              mode="single"
                              selected={date}
                              onSelect={setDate}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="gender">Giới Tính</Label>
                      <Select onValueChange={setGender} value={gender}>
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn giới tính" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Nam">Nam</SelectItem>
                          <SelectItem value="Nữ">Nữ</SelectItem>
                          <SelectItem value="Khác">Khác</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="col-span-1 grid gap-3 border-l border-divider pl-5">
                    {/* <div className="flex justify-between">
                      <div className="flex flex-1 flex-col gap-1 text-sm font-semibold text-neutral-900">
                        <p className="">Số điện thoại</p>
                        <p className="font-medium text-neutral-600 break-all">
                          **** *** 764
                        </p>
                      </div>
                    </div> */}

                    <div className="space-y-2">
                      <Label htmlFor="phone">Số điện thoại</Label>
                      <Input
                        id="phone"
                        placeholder="Số điện thoại"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                      />
                    </div>

                    <div className="flex justify-between">
                      <div className="flex flex-1 flex-col gap-1 text-sm font-semibold text-neutral-900">
                        <p>Email</p>
                        <p className="font-medium text-neutral-600 break-all">
                          {userInfo?.accountId?.email || "Chưa cập nhật"}
                        </p>
                      </div>
                      <div
                        className="flex-2 flex cursor-pointer justify-end gap-1 text-sm font-normal"
                        onClick={() => navigate("/account/info/update-email")}
                      >
                        <span className="cursor-pointer text-green-500">
                          Cập nhật
                        </span>
                        <FaChevronRight className="mt-1 text-green-500" />
                      </div>
                    </div>

                    {/* <div className="flex justify-between">
                      <div className="flex-1">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" placeholder="Email" />
                      </div>
                    </div> */}

                    <div className="flex justify-between">
                      <div className="flex flex-1 flex-col gap-1 text-sm font-semibold text-neutral-900">
                        <p className="">Mật khẩu</p>
                        <div className="text-sm font-medium">Tạo mật khẩu</div>
                      </div>
                      <div
                        className="flex-2 flex cursor-pointer justify-end gap-1 text-sm font-normal"
                        onClick={() =>
                          navigate("/account/info/update-password")
                        }
                      >
                        <span className="cursor-pointer text-green-500">
                          Cập nhật
                        </span>
                        <FaChevronRight className="mt-1 text-green-500" />
                      </div>
                    </div>
                  </div>
                </div>
                <Button
                  disabled={isDisabled()}
                  className="mt-10 bg-green-500 hover:bg-green-600 disabled:bg-neutral-100 disabled:text-neutral-700"
                  onClick={handleSubmit}
                >
                  Lưu thay đổi
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalInfo;
