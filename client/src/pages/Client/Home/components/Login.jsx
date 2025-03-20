import { LOGIN_ROUTE, SIGNUP_ROUTE } from "@/API/index.api.js";
import { Button } from "@/components/ui/button.jsx";
import { Input } from "@/components/ui/input";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp"; // Thêm InputOTP từ Shadcn
import { apiClient } from "@/lib/api-client.js";
import Loading from "@/pages/component/Loading.jsx";
import { useAppStore } from "@/store/index.js";
import { useState, useEffect, useRef } from "react";
import { IoIosClose } from "react-icons/io";
import { toast } from "sonner";
import { useLocation } from "react-router-dom";
import {
  auth,
  signInWithPhoneNumber,
  RecaptchaVerifier,
} from "@/config/firebase.config.js";

const Login = ({ close }) => {
  const { setUserInfo } = useAppStore();
  const location = useLocation();

  const [isLoading, setIsLoading] = useState(false);
  // const [isLogin, setIsLogin] = useState(true);
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [otpCooldown, setOtpCooldown] = useState(0);
  const [showRecaptcha, setShowRecaptcha] = useState(false);
  const [step, setStep] = useState("phone");
  const recaptchaRef = useRef(null);

  const handlePhoneChange = (e) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      setPhone(value);
    }
  };
  const handleOtpChange = (value) => setOtp(value);
  const handlePasswordChange = (e) => setPassword(e.target.value);
  const isContinueDisabled = !phone || phone.length < 10;
  const isButtonDisabled = isOtpSent ? !otp : !password;

  const formatPhoneNumber = (phoneNumber) => {
    const cleaned = phoneNumber.replace(/\D/g, "");
    if (cleaned.startsWith("0")) {
      return `+84${cleaned.slice(1)}`;
    }
    if (cleaned.startsWith("+84")) {
      return cleaned;
    }
    return `+84${cleaned}`;
  };

  // useEffect(() => {
  //   if (recaptchaRef.current) {
  //     window.recaptchaVerifier = new RecaptchaVerifier(
  //       auth,
  //       "recaptcha-container",
  //       {
  //         size: "normal",
  //         callback: () => {
  //           console.log("reCAPTCHA verified");
  //         },
  //         "expired-callback": () => {
  //           toast.error("Mã xác thực đã hết hạn. Vui lòng thử lại.");
  //         },
  //       }
  //       // auth
  //     );

  //     window.recaptchaVerifier.render().catch((error) => {
  //       console.error("Error rendering reCAPTCHA:", error);
  //     });
  //   }

  //   return () => {
  //     if (window.recaptchaVerifier) {
  //       window.recaptchaVerifier.clear();
  //       window.recaptchaVerifier = null;
  //     }
  //   };
  // }, []);

  useEffect(() => {
    let timer;
    if (otpCooldown > 0) {
      timer = setInterval(() => {
        setOtpCooldown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [otpCooldown]);

  const handleContinue = () => {
    if (phone.length !== 10) {
      toast.error("Số điện thoại phải có đúng 10 số!");
      return;
    }
    setStep("method"); // Chuyển sang bước chọn phương thức
  };

  const handleSendOtp = async (e) => {
    e?.preventDefault();
    // setIsLoading(true);
    try {
      setShowRecaptcha(true);
      await new Promise((resolve) => setTimeout(resolve, 100));

      if (window.recaptchaVerifier) {
        window.recaptchaVerifier.clear();
        window.recaptchaVerifier = null;
      }

      window.recaptchaVerifier = new RecaptchaVerifier(
        auth,
        "recaptcha-container",
        {
          size: "normal",
          callback: () => {
            console.log("reCAPTCHA verified");
          },
          "expired-callback": () => {
            toast.error("Mã xác thực đã hết hạn. Vui lòng thử lại.");
            setShowRecaptcha(false);
          },
        }
        // auth
      );
      await window.recaptchaVerifier.render();

      const formattedPhone = formatPhoneNumber(phone);

      console.log("Formatted phone:", formattedPhone);
      console.log("RecaptchaVerifier:", window.recaptchaVerifier);

      const appVerifier = window.recaptchaVerifier;

      if (!appVerifier)
        throw new Error("RecaptchaVerifier chưa được khởi tạo!");

      const result = await signInWithPhoneNumber(
        auth,
        formattedPhone,
        appVerifier
      );

      console.log("Confirmation result:", result);

      setConfirmationResult(result);
      setIsOtpSent(true);
      setOtpCooldown(60);
      setStep("otp");
      toast.success("Mã OTP đã được gửi đến số điện thoại của bạn!");
    } catch (error) {
      console.error("Lỗi chi tiết:", error.code, error.message);
      toast.error(`Lỗi khi gửi OTP: ${error.code} - ${error.message}`);
      setShowRecaptcha(false); // Ẩn reCAPTCHA nếu có lỗi
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (!confirmationResult) throw new Error("Không có kết quả xác minh OTP");
      const result = await confirmationResult.confirm(otp);
      const user = result.user;
      console.log("OTP verified, user:", user);

      const formattedPhone = formatPhoneNumber(phone);
      const res = await apiClient.post(LOGIN_ROUTE, { phone: formattedPhone });

      console.log("Login response:", res);

      if (res.status === 200 && res.data.status === 200) {
        setUserInfo(res.data.data);
        const from = location.state?.from?.pathname || "/";
        window.location.replace(from);
      } else if (res.status === 200 && res.data.status === 400) {
        // Tự động đăng ký nếu số điện thoại không tồn tại
        const signupRes = await apiClient.post(SIGNUP_ROUTE, {
          phone: formattedPhone,
        });

        console.log("Signup response:", signupRes);
        if (signupRes.status === 200 && signupRes.data.status === 201) {
          setUserInfo(signupRes.data.data);
          const from = location.state?.from?.pathname || "/";
          window.location.replace(from);
          toast.success("Đăng nhập thành công!");
        } else {
          toast.error(signupRes.data.message);
        }
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.error("Verify OTP error:", error);
      toast.error("Mã OTP không đúng hoặc có lỗi: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const formattedPhone = formatPhoneNumber(phone);
      const res = await apiClient.post(LOGIN_ROUTE, {
        phone: formattedPhone,
        password,
      });
      console.log("Login response:", res);

      if (res.status === 200 && res.data.status === 200) {
        setUserInfo(res.data.data);
        const from = location.state?.from?.pathname || "/";
        window.location.replace(from);
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.error("Password login error:", error);
      toast.error("Đăng nhập thất bại: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    return () => {
      if (window.recaptchaVerifier) {
        window.recaptchaVerifier.clear();
        window.recaptchaVerifier = null;
      }
    };
  }, []);

  return (
    <div className="fixed top-0 left-0 bottom-0 right-0 bg-black/30 flex justify-center items-center z-[9999]">
      {isLoading && <Loading />}
      <div className="grid focus-visible:outline-0 md:block px-4 md:px-6 pt-28 pb-6 left-0 fixed bottom-0 right-0 top-0 z-50 w-full gap-4 border bg-background shadow-lg duration-200 md:left-[50%] md:h-fit md:max-h-[95%] md:w-full md:translate-x-[-50%] md:rounded-lg overflow-x-hidden border-white md:top-[5%] md:max-w-[413px] md:translate-y-0 md:border-neutral-200 md:pt-6">
        <IoIosClose
          className="absolute right-2 top-4 text-5xl"
          onClick={close}
        />
        <div className="mb-5">
          <h2 className="text-2xl font-bold uppercase pb-3">XIN CHÀO,</h2>
          <span>Vui lòng nhập số điện thoại để tiếp tục</span>
        </div>

        <form className="space-y-5">
          <div className="space-y-4">
            {/* Bước nhập số điện thoại */}
            {step === "phone" && (
              <>
                <div>
                  <label className="leading-none w-fit font-semibold">
                    Số điện thoại
                  </label>
                </div>
                <div className="relative flex">
                  <Input
                    className="w-full border border-neutral-500 text-neutral-900 rounded-lg placeholder:text-neutral-600 font-semibold outline-none text-lg p-4 h-13.5"
                    placeholder="Nhập số điện thoại (0987654321)"
                    type="tel"
                    value={phone}
                    onChange={handlePhoneChange}
                    maxLength={10}
                  />
                </div>
                <Button
                  disabled={isContinueDisabled}
                  className="w-full bg-green-500 hover:bg-green-600 text-white"
                  onClick={handleContinue}
                >
                  Tiếp tục
                </Button>
              </>
            )}

            {/* Bước chọn phương thức */}
            {step === "method" && (
              <div className="space-y-4">
                <div
                  id="recaptcha-container"
                  ref={recaptchaRef}
                  style={{ display: showRecaptcha ? "block" : "none" }}
                ></div>
                <Button
                  className="w-full bg-green-500 hover:bg-green-600 text-white"
                  onClick={(e) => {
                    e.preventDefault();
                    handleSendOtp(e);
                  }}
                >
                  Đăng nhập bằng OTP
                </Button>
                <Button
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white"
                  onClick={(e) => {
                    e.preventDefault();
                    setStep("password");
                  }}
                >
                  Đăng nhập bằng mật khẩu
                </Button>
              </div>
            )}

            {/* Bước nhập OTP */}
            {step === "otp" && (
              <>
                <div>
                  <label className="leading-none w-fit font-semibold">
                    Nhập mã OTP
                  </label>
                </div>
                <InputOTP maxLength={6} value={otp} onChange={handleOtpChange}>
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
                {showRecaptcha && (
                  <div id="recaptcha-container" ref={recaptchaRef}></div>
                )}
                <Button
                  disabled={isButtonDisabled}
                  className="w-full bg-green-500 hover:bg-green-600 text-white"
                  onClick={handleVerifyOtp}
                >
                  Xác minh OTP
                </Button>
              </>
            )}

            {/* Bước nhập mật khẩu */}
            {step === "password" && (
              <>
                <div>
                  <label className="leading-none w-fit font-semibold">
                    Mật khẩu
                  </label>
                </div>
                <Input
                  className="w-full border border-neutral-500 text-neutral-900 rounded-lg placeholder:text-neutral-600 font-semibold outline-none text-lg p-4 h-13.5"
                  placeholder="Nhập mật khẩu"
                  type="password"
                  value={password}
                  onChange={handlePasswordChange}
                />
                <Button
                  disabled={isButtonDisabled}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white"
                  onClick={handlePasswordLogin}
                >
                  Đăng nhập
                </Button>
              </>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
