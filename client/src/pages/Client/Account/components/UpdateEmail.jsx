import { UPDATE_EMAIL_ROUTE } from "@/API/index.api.js";
import { Button } from "@/components/ui/button.jsx";
import { Input } from "@/components/ui/input.jsx";
import { apiClient } from "@/lib/api-client.js";
import Loading from "@/pages/component/Loading.jsx";
import { useAppStore } from "@/store/index.js";
import { useState } from "react";
import { IoChevronBack } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const UpdateEmail = () => {
  const navigate = useNavigate();
  const { userInfo, setUserInfo } = useAppStore();

  const [newEmail, setNewEmail] = useState("");
  const [error, serError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const checkEmail = (email) => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  };

  const handleChangeEmail = async (e) => {
    e.preventDefault();
    if (!checkEmail(newEmail)) {
      serError(true);
      setErrorMessage("Email không hợp lệ");
      return;
    }

    try {
      setIsLoading(true);
      const res = await apiClient.put(
        `${UPDATE_EMAIL_ROUTE}/${userInfo.accountId._id}`,
        {
          email: newEmail,
        }
      );
      if (res.status === 200 && res.data.status === 200) {
        setUserInfo({
          ...userInfo,
          accountId: { ...userInfo.accountId, email: newEmail },
        });
        toast.success(res.data.message);
        navigate(-1);
      } else {
        serError(true);
        setErrorMessage(res.data.message);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const isDisable = newEmail === "";

  return (
    <>
    {isLoading && <Loading />}
    <div>
      <div className=" hidden md:block">
        <div className="flex items-center text-xl font-semibold">
          <Button
            className="bg-transparent shadow-none text-black hover:bg-transparent"
            onClick={() => {
              navigate(-1);
            }}
          >
            <IoChevronBack />
          </Button>
          <p>Cập nhật Email</p>
        </div>
      </div>

      <div className="rounded-lg bg-white p-4 md:p-6">
        <div className="mb-4 text-sm font-medium">
          Mã xác thực (OTP) sẽ được gửi đến email này để xác minh email là của
          bạn
        </div>
        <form className="max-w-[416px] block">
          <div className="space-y-4">
            <label
              htmlFor="new-email"
              className="block text-sm font-medium text-gray-700"
            >
              Email mới
            </label>
            <div className="relative">
              <Input
                id="new-email"
                // type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                className={`pr-10 ${
                  error ? "border-red-500 focus-visible:ring-0" : ""
                }`}
                placeholder="Email mới"
              />
              {error && (
                <p className="text-red-500 text-sm mt-1">{errorMessage}</p>
              )}
            </div>
          </div>

          <div className="mt-10">
            <Button
              disabled={isDisable}
              className="bg-green-500 hover:bg-green-600 disabled:bg-neutral-100 disabled:text-neutral-700"
              onClick={handleChangeEmail}
              type="submit"
            >
              Cập nhật email
            </Button>
          </div>
        </form>
      </div>
    </div>
    </>
  );
};

export default UpdateEmail;
