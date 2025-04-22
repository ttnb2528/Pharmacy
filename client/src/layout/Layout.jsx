import { HomeContext } from "@/context/HomeContext.context.jsx";
import { useMediaQuery } from "@/hook/use-media-query.js";
import Login from "@/pages/Client/Home/components/Login.jsx";
import FloatingActions from "@/pages/component/FloatingActions.jsx";
import Footer from "@/pages/component/Footer/Footer.jsx";
import MobileNavBar from "@/pages/component/mobile-nav-bar.jsx";
import Navbar from "@/pages/component/Navbar/Navbar.jsx";
import { useContext } from "react";
import { Outlet, useLocation } from "react-router-dom";

export const Layout = () => {
  const { showLogin, setShowLogin } = useContext(HomeContext);
  const location = useLocation();
  const isHomePage = location.pathname === "/";
  const isMobile = useMediaQuery("(max-width: 640px)");
  return (
    <>
      {showLogin && <Login close={() => setShowLogin(false)} />}
      <div
        className={`${
          isMobile ? "h-full" : "h-[100vh]"
        }  md:h-full flex flex-col w-full bg-[#e5e5e5] pb-16 md:pb-0`}
      >
        <div
          className={`${
            !isHomePage ? "hidden md:block" : ""
          } w-full bg-[#26773d] z-30 `}
        >
          <Navbar />
        </div>
        <div className="w-full md:w-[90vw] lg:w-[80vw] sm:mx-auto flex flex-col">
          <Outlet />
        </div>
        <div className={`${!isHomePage ? "hidden md:block" : ""}`}>
          <Footer />
        </div>
      </div>

      <MobileNavBar />
      <FloatingActions zaloLink="https://zalo.me/84866554764" />
    </>
  );
};
