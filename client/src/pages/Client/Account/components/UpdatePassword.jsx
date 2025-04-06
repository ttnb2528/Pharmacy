import Loading from "@/pages/component/Loading.jsx";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

// Component UI
import { Button } from "@/components/ui/button.jsx";
import { Input } from "@/components/ui/input.jsx";

// Icon
import { IoChevronBack } from "react-icons/io5";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { toast } from "sonner";
import { apiClient } from "@/lib/api-client.js";
import { UPDATE_PASSWORD_ROUTE } from "@/API/index.api.js";
import { isDisableAll } from "@/utils/isDisableAll.jsx";
import { useAppStore } from "@/store/index.js";
import { useMediaQuery } from "@/hook/use-media-query.js";
import MobilePersonalInfoHeader from "./MobilePersonalInfoHeader.jsx";
import { Label } from "@/components/ui/label.jsx";

const UpdatePassword = () => {
  // const { userData } = useContext(PharmacyContext);
  const { userInfo } = useAppStore();

  const [isLoading, setIsLoading] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const isMobile = useMediaQuery("(max-width: 640px)");
  const navigate = useNavigate();

  const toggleNewPasswordVisibility = () =>
    setShowNewPassword(!showNewPassword);
  const toggleConfirmPasswordVisibility = () =>
    setShowConfirmPassword(!showConfirmPassword);

  const validatePassword = () => {
    if (newPassword.length < 8) {
      toast.warning("Mật khẩu phải có ít nhất 8 kí tự");
      return false;
    } else if (newPassword.length > 16) {
      toast.warning("Mật khẩu không được quá 16 kí tự");
      return false;
    }
    if (newPassword !== confirmPassword) {
      toast.warning("Mật khẩu không trùng khớp");
      return false;
    }
    return true;
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      // Call API to change password
      if (!validatePassword()) {
        setIsLoading(false);
        return;
      }

      const res = await apiClient.put(
        `${UPDATE_PASSWORD_ROUTE}/${userInfo.accountId._id}`,
        {
          password: newPassword,
        }
      );

      if (res.status === 200 && res.data.status === 200) {
        toast.success(res.data.message);
        navigate(-1);
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const isDisable = isDisableAll(newPassword, confirmPassword);

  return (
    <div>
      {isLoading && <Loading />}
      {/* Mobile header */}
      {isMobile && <MobilePersonalInfoHeader title="Tạo mật khẩu mới" />}

      {!isMobile && (
        <div className="hidden md:block">
          <div className="flex items-center text-xl font-semibold">
            <Button
              className="bg-transparent shadow-none text-black hover:bg-transparent"
              onClick={() => {
                navigate(-1);
              }}
            >
              <IoChevronBack />
            </Button>
            <p>Tạo mật khẩu mới</p>
          </div>
        </div>
      )}

      <div className={`rounded-lg bg-white ${isMobile ? "p-4" : "p-6"}`}>
        <div className="mb-4 text-sm font-medium">
          Để bảo mật tài khoản, vui lòng không chia sẻ mật khẩu cho người khác.
          Bạn có thể tạo mật khẩu từ 8 - 16 kí tự.
        </div>

        <form
          className={`${isMobile ? "w-full" : "max-w-[416px]"} block`}
          onSubmit={(e) => e.preventDefault()} // Ngăn form submit theo cách thông thường
        >
          <div className="space-y-4">
            <div className="space-y-2">
              <Label
                htmlFor="new-password"
                className="block text-sm font-medium text-gray-700"
              >
                Mật khẩu mới
              </Label>
              <div className="relative">
                <Input
                  id="new-password"
                  type={showNewPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="pr-10"
                  autoComplete="new-password"
                />
                <Button
                  type="button"
                  className="absolute shadow-none right-0 top-0 h-full px-3 py-2 bg-transparent hover:bg-transparent"
                  onClick={toggleNewPasswordVisibility}
                >
                  {showNewPassword ? (
                    <FaEyeSlash className="h-4 w-4 text-gray-500" />
                  ) : (
                    <FaEye className="h-4 w-4 text-gray-500" />
                  )}
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="confirm-password"
                className="block text-sm font-medium text-gray-700"
              >
                Nhập lại mật khẩu mới
              </Label>
              <div className="relative">
                <Input
                  id="confirm-password"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="pr-10"
                  autoComplete="new-password"
                />
                <Button
                  type="button"
                  className="absolute shadow-none right-0 top-0 h-full px-3 py-2 bg-transparent hover:bg-transparent"
                  onClick={toggleConfirmPasswordVisibility}
                >
                  {showConfirmPassword ? (
                    <FaEyeSlash className="h-4 w-4 text-gray-500" />
                  ) : (
                    <FaEye className="h-4 w-4 text-gray-500" />
                  )}
                </Button>
              </div>
            </div>
          </div>

          <Button
            disabled={isDisable}
            onClick={(e) => {
              e.preventDefault(); // Ngăn sự kiện click gây submit form
              handleChangePassword(e);
            }}
            type="button" // Đã đúng, nhưng đảm bảo lại một lần nữa
            className={`${
              isMobile ? "w-full" : ""
            } mt-10 bg-green-500 hover:bg-green-600 disabled:bg-neutral-100 disabled:text-neutral-700`}
          >
            Lưu thay đổi
          </Button>
        </form>
      </div>
    </div>
  );
};

export default UpdatePassword;
