import { HomeContext } from "@/context/HomeContext.context.jsx";
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
  return (
    <>
      {showLogin && <Login close={() => setShowLogin(false)} />}
      <div className="h-full flex flex-col w-full bg-[#e5e5e5] pb-16 md:pb-0">
        <div className="w-full bg-[#26773d] z-30 ">
          <Navbar />
        </div>
        <div className="w-[95vw] md:w-[90vw] lg:w-[80vw] mx-auto flex flex-col">
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
