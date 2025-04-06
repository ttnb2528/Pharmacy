import { Outlet, useLocation, useNavigate } from "react-router-dom";
import AccountSmall from "./components/AccountSmall.jsx";
import { useMediaQuery } from "@/hook/use-media-query.js";
import { useEffect, useState, useRef } from "react";
import MobileAccountHeader from "./components/MobileAccountHeader.jsx";
import MobileMembershipCard from "./components/MobileMembershipCard.jsx";
import MobileAccountMenu from "./components/MobileAccountMenu.jsx";

const Account = () => {
  const isMobile = useMediaQuery("(max-width: 640px)");
  const [isMainAccountPage, setIsMainAccountPage] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const lastSubpageRef = useRef("/account/info"); // Trang con mặc định
  const wasInMobileRef = useRef(false); // Theo dõi trạng thái mobile trước đó

  useEffect(() => {
    // Check if we're on the main account page or a subpage
    const checkPath = () => {
      const path = location.pathname;
      const isMain = path === "/account" || path === "/account/";
      setIsMainAccountPage(isMain);

      // Lưu URL trang con nếu đang ở trang con
      if (!isMain && path.startsWith("/account/")) {
        lastSubpageRef.current = path;
      }
    };

    checkPath();
  }, [location]);

  // Theo dõi thay đổi từ mobile sang desktop
  useEffect(() => {
    // Khi thay đổi từ mobile sang desktop
    if (wasInMobileRef.current && !isMobile) {
      // Nếu đang ở trang chính, chuyển đến trang con cuối cùng
      if (
        location.pathname === "/account" ||
        location.pathname === "/account/"
      ) {
        navigate(lastSubpageRef.current);
      }
    }

    // Cập nhật trạng thái mobile
    wasInMobileRef.current = isMobile;
  }, [isMobile, navigate, location.pathname]);

  return (
    <div
      className={`${
        isMobile ? "" : "mx-auto"
      } max-w-screen-xl md:container md:pb-4`}
    >
      <div className="md:mt-6 md:flex md:gap-4">
        {!isMobile && <AccountSmall />}

        {/* Mobile view */}
        {isMobile && isMainAccountPage && (
          <>
            <MobileAccountHeader />
            <MobileMembershipCard />
            <MobileAccountMenu />
          </>
        )}

        {/* {isMobile && !isMainAccountPage && <MobileAccountHeader />} */}

        {/* Content area */}
        <div className="flex-1 md:max-w-[calc(1200px-288px-16px)]">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Account;
