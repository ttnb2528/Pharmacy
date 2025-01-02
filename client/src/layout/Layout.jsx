import Footer from "@/pages/component/Footer/Footer.jsx";
import Navbar from "@/pages/component/Navbar/Navbar.jsx";
import { Outlet } from "react-router-dom";

export const Layout = () => {
  return (
    <div className="h-full flex flex-col w-full bg-[#e5e5e5]">
      <div className="w-full bg-[#26773d] sticky z-30 top-0">
        <Navbar />
      </div>
      <div className="w-[80vw] mx-auto flex flex-col">
        <Outlet />
      </div>
      <div className="">
        <Footer />
      </div>
    </div>
  );
};
