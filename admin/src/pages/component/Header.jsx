// components/Header.jsx
import { LOGOUT_ROUTE } from "@/API/index.api.js";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { apiClient } from "@/lib/api-admin.js";
import { toast } from "sonner";

const Header = ({ title }) => {
  const handleLogout = async () => {
    try {
      const res = await apiClient.post(LOGOUT_ROUTE, { role: "admin" });
      if (res.status === 200 && res.data.status === 200) {
        toast.success(res.data.message);
        localStorage.removeItem("user");
        window.location.href = "/login";
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <header className="flex items-center justify-between p-4 border-b">
      <SidebarTrigger />
      <h1 className="text-2xl font-bold">{title}</h1>
      <Button onClick={handleLogout}>Đăng xuất</Button>
    </header>
  );
};

export default Header;
