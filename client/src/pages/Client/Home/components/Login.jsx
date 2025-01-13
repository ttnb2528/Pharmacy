import { LOGIN_ROUTE, SIGNUP_ROUTE } from "@/API/index.api.js";
import { Button } from "@/components/ui/button.jsx";
import { Input } from "@/components/ui/input";
import { apiClient } from "@/lib/api-client.js";
import Loading from "@/pages/component/Loading.jsx";
import { useAppStore } from "@/store/index.js";
import { useState } from "react";
import { IoIosClose } from "react-icons/io";
import { toast } from "sonner";

const Login = ({ close }) => {
  const { setUserInfo } = useAppStore();

  const [isLoading, setIsLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleEmailChange = (e) => setEmail(e.target.value);
  const handlePasswordChange = (e) => setPassword(e.target.value);
  const handleConfirmPasswordChange = (e) => setConfirmPassword(e.target.value);

  const isButtonDisabled = isLogin
    ? !email || !password
    : !email || !password || !confirmPassword;

  const validateLogin = () => {
    if (!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
      toast.error("Email không hợp lệ");
      return false;
    }
    if (!password.length) {
      toast.error("Mật khẩu không được để trống");
      return false;
    }
    return true;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (validateLogin()) {
        const res = await apiClient.post(LOGIN_ROUTE, { email, password });
        console.log(res.data);
        if (res.status === 200 && res.data.status === 200) {
          setUserInfo(res.data.data);
          localStorage.setItem("token", res.data.data.token);

          window.location.replace("/");
        } else {
          toast.error(res.data.message);
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const validateSignup = () => {
    if (!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
      toast.error("Email không hợp lệ");
      return false;
    }
    if (!password.length) {
      toast.error("Mật khẩu không được để trống");
      return false;
    }
    if (password !== confirmPassword) {
      toast.error("Mật khẩu không khớp");
      return false;
    }
    return true;
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (validateSignup()) {
        const res = await apiClient.post(SIGNUP_ROUTE, { email, password });
        if (res.status === 200 && res.data.status === 201) {
          toast.success(res.data.message);
          setUserInfo(res.data.data);
          setIsLogin(true);
        }
        // console.log(res);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed top-0 left-0 bottom-0 right-0 bg-black/30 flex justify-center items-center">
      {isLoading && <Loading />}
      <div
        className="grid focus-visible:outline-0 md:block px-4 md:px-6 pt-28 pb-6 left-0 fixed bottom-0 right-0 top-0 z-50 w-full 
                    gap-4 border bg-background shadow-lg duration-200 md:left-[50%] md:h-fit md:max-h-[95%] md:w-full md:translate-x-[-50%] 
                    md:rounded-lg overflow-x-hidden border-white md:top-[5%] md:max-w-[413px] md:translate-y-0 md:border-neutral-200 md:pt-6"
      >
        <IoIosClose
          className="absolute right-2 top-4 text-5xl"
          onClick={close}
        />
        <div className="mb-5">
          <h2 className="text-2xl font-bold uppercase pb-3">XIN CHÀO,</h2>
          {/* <span>Vui lòng nhập số điện thoại để tiếp tục</span> */}
          <span>Vui lòng nhập email, mật khẩu để tiếp tục</span>
        </div>
        {/* <form className="space-y-4">
          <div className="space-y-2">
            <label className="leading-none w-fit font-semibold">
              Số điện thoại
            </label>
            <div className="relative flex">
              <Input
                className="w-full border border-neutral-500 text-neutral-900 rounded-lg placeholder:text-neutral-600 font-semibold focus:ring-neutral-500 focus:border-neutral-700 outline-none text-lg p-4 h-13.5"
                placeholder="Nhập số điện thoại"
                type="tel"
                pattern="[0-9]*"
                onKeyPress={(event) => {
                  if (!/[0-9]/.test(event.key)) {
                    event.preventDefault();
                  }
                }}
              />
            </div>
          </div>
          <Button
            type="submit"
            className="relative flex justify-center outline-none font-semibold border-0 w-full text-base px-5 py-2.5 h-12 items-center rounded-lg cursor-not-allowed bg-neutral-100 hover:bg-neutral-100 hover:text-neutral-600 focus:ring-neutral-100 text-neutral-600"
          >
            <span>Tiếp tục</span>
          </Button>
        </form> */}

        <form className="space-y-5">
          <div className="space-y-2">
            <div>
              <label className="leading-none w-fit font-semibold">Email</label>
            </div>

            <div className="relative flex">
              <Input
                className="w-full border border-neutral-500 text-neutral-900 rounded-lg placeholder:text-neutral-600 font-semibold outline-none text-lg p-4 h-13.5"
                placeholder="Nhập email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={handleEmailChange}
              />
            </div>

            <div>
              <label className="leading-none w-fit font-semibold">
                Mật khẩu
              </label>
            </div>

            <div className="relative flex">
              <Input
                className="w-full border border-neutral-500 text-neutral-900 rounded-lg placeholder:text-neutral-600 font-semibold outline-none text-lg p-4 h-13.5"
                placeholder="Nhập mật khẩu"
                type="password"
                autoComplete="new-password"
                value={password}
                onChange={handlePasswordChange}
              />
            </div>

            {!isLogin && (
              <>
                <div>
                  <label className="leading-none w-fit font-semibold">
                    Nhập lại mật khẩu
                  </label>
                </div>

                <div className="relative flex">
                  <Input
                    className="w-full border border-neutral-500 text-neutral-900 rounded-lg placeholder:text-neutral-600 font-semibold outline-none text-lg p-4 h-13.5"
                    placeholder="Nhập mật khẩu"
                    type="password"
                    autoComplete="new-password"
                    value={confirmPassword}
                    onChange={handleConfirmPasswordChange}
                  />
                </div>
              </>
            )}

            {isLogin ? (
              <div className="relative flex justify-end text-xs my-2">
                Chưa có tài khoản?,
                <span
                  className="text-green-600 cursor-pointer ml-1"
                  onClick={() => setIsLogin(false)}
                >
                  đăng ký ngay
                </span>
              </div>
            ) : (
              <div className="relative flex justify-end text-xs my-2">
                Đã có tài khoản?,
                <span
                  className="text-green-600 cursor-pointer ml-1"
                  onClick={() => setIsLogin(true)}
                >
                  đăng nhập ngay
                </span>
              </div>
            )}
          </div>

          <Button
            disabled={isButtonDisabled}
            className="relative flex justify-center outline-none font-semibold border-0 w-full text-base px-5 py-2.5 h-12 items-center rounded-lg disabled:bg-neutral-100 disabled:text-neutral-700 bg-green-500 hover:bg-green-600 focus:ring-neutral-100 text-white"
            onClick={isLogin ? handleLogin : handleSignup}
          >
            <span>Tiếp tục</span>
          </Button>
        </form>

        <div className="mb-12 mt-16 space-y-4 md:mb-0">
          <div className="text-center font-semibold text-neutral-600">Hoặc</div>
          <div>
            <div className="">
              <button
                data-size="md"
                type="button"
                className="relative flex justify-center outline-none font-semibold bg-neutral-200 border-0 hover:bg-neutral-300 focus:ring-neutral-300 text-neutral-900 w-full text-base px-5 py-2.5 h-12 items-center rounded-lg"
              >
                <span className="p-icon inline-flex align-[-0.125em] justify-center max-h-full max-w-full w-6 h-6 mr-1.5">
                  <svg
                    viewBox="0 0 25 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g clipPath="url(#clip0_338_15326)">
                      <path
                        d="M7.43242 14.0863L6.73625 16.6852L4.19176 16.739C3.43133 15.3286 3 13.7149 3 12C3 10.3418 3.40328 8.77804 4.11812 7.40112H4.11867L6.38398 7.81644L7.37633 10.0682C7.16863 10.6737 7.05543 11.3237 7.05543 12C7.05551 12.7341 7.18848 13.4374 7.43242 14.0863Z"
                        fill="#FBBB00"
                      ></path>
                      <path
                        d="M22.8253 10.1318C22.9401 10.7368 23 11.3615 23 12C23 12.7159 22.9247 13.4143 22.7813 14.0879C22.2945 16.3802 21.0225 18.3818 19.2605 19.7983L19.2599 19.7978L16.4066 19.6522L16.0028 17.1313C17.172 16.4456 18.0858 15.3725 18.5671 14.0879H13.2198V10.1318H18.6451H22.8253Z"
                        fill="#518EF8"
                      ></path>
                      <path
                        d="M19.2599 19.7977L19.2604 19.7983C17.5467 21.1757 15.3698 21.9999 13 21.9999C9.19177 21.9999 5.8808 19.8713 4.19177 16.7389L7.43244 14.0862C8.27693 16.34 10.4511 17.9444 13 17.9444C14.0956 17.9444 15.122 17.6483 16.0027 17.1312L19.2599 19.7977Z"
                        fill="#28B446"
                      ></path>
                      <path
                        d="M19.383 4.30219L16.1434 6.95437C15.2319 6.38461 14.1544 6.05547 13 6.05547C10.3934 6.05547 8.17859 7.73348 7.37641 10.0681L4.11871 7.40109H4.11816C5.78246 4.1923 9.1352 2 13 2C15.4264 2 17.6511 2.8643 19.383 4.30219Z"
                        fill="#F14336"
                      ></path>
                    </g>
                    <defs>
                      <clipPath id="clip0_338_15326">
                        <rect
                          width="20"
                          height="20"
                          fill="white"
                          transform="translate(3 2)"
                        ></rect>
                      </clipPath>
                    </defs>
                  </svg>
                </span>
                Tiếp tục với Google
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
