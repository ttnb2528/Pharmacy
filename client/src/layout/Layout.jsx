import Footer from "@/pages/component/Footer/Footer.jsx";
import Navbar from "@/pages/component/Navbar/Navbar.jsx";
import { Outlet } from "react-router-dom";

export const Layout = () => {
  return (
    <div className="h-[100vh] flex flex-col w-full">
      <div className="w-full bg-[rgb(38,119,61)] sticky z-30 top-0">
        <Navbar />
      </div>
      <div className="content">
        <Outlet />
      </div>
      <div className="footer">
        <Footer />
      </div>
    </div>
  );
};
