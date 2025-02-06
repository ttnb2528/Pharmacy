import { HomeContext } from "@/context/HomeContext.context.jsx";
import Login from "@/pages/Client/Home/components/Login.jsx";
import Footer from "@/pages/component/Footer/Footer.jsx";
import Navbar from "@/pages/component/Navbar/Navbar.jsx";
import { useContext } from "react";
import { Outlet } from "react-router-dom";

export const Layout = () => {
  const { showLogin, setShowLogin } = useContext(HomeContext);
  return (
    <>
      {showLogin && <Login close={() => setShowLogin(false)} />}
      <div className="h-full flex flex-col w-full bg-[#e5e5e5]">
        <div className="w-full bg-[#26773d] z-30 ">
          <Navbar />
        </div>
        <div className="w-[80vw] mx-auto flex flex-col">
          <Outlet />
        </div>
        <div className="">
          <Footer />
        </div>
      </div>
    </>
  );
};
