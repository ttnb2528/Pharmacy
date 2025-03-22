import {
  Activity,
  Calendar,
  DollarSign,
  Home,
  Layers,
  Pill,
  ShoppingCart,
  Tag,
  Truck,
  Users,
  Settings,
  LogOut,
  CreditCard,
  User,
  SlidersIcon
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarFooter,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link, Outlet } from "react-router-dom";
import { apiClient } from "@/lib/api-admin.js";
import { LOGOUT_ROUTE } from "@/API/index.api.js";
import { toast } from "sonner";
import { getInitials } from "@/utils/getInitialName.js";
import { useAppStore } from "@/store/index.js";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

const sidebarItems = [
  { icon: Home, label: "Tổng quan", to: "/", roles: ["admin", "employee"] },
  {
    icon: Pill,
    label: "Quản lý thuốc",
    to: "/products",
    roles: ["admin", "employee"],
  },
  {
    icon: SlidersIcon,
    label: "Quản lý Slider Ảnh",
    to: "/slider",
    roles: ["admin"],
  },
  {
    icon: CreditCard,
    label: "Bán thuốc",
    to: "/sell-medicine",
    roles: ["admin", "employee"],
  },
  {
    icon: Tag,
    label: "Thương hiệu",
    to: "/brands",
    roles: ["admin"],
  },
  {
    icon: Layers,
    label: "Danh mục",
    to: "/categories",
    roles: ["admin"],
  },
  {
    icon: Truck,
    label: "Nhà sản xuất",
    to: "/manufacturers",
    roles: ["admin"],
  },
  {
    icon: Truck,
    label: "Nhà cung cấp",
    to: "/suppliers",
    roles: ["admin"],
  },
  {
    icon: DollarSign,
    label: "Mã giảm giá",
    to: "/coupons",
    roles: ["admin"],
  },
  {
    icon: Users,
    label: "Khách hàng",
    to: "/customers",
    roles: ["admin", "employee"],
  },
  { icon: Users, label: "Nhân viên", to: "/employees", roles: ["admin"] },
  { icon: Calendar, label: "Giờ làm", to: "/shift-works", roles: ["admin"] },
  {
    icon: ShoppingCart,
    label: "Đơn hàng",
    to: "/orders",
    roles: ["admin", "employee"],
  },
  {
    icon: DollarSign,
    label: "Hóa đơn",
    to: "/bills",
    roles: ["admin", "employee"],
  },
  {
    icon: Activity,
    label: "Thống kê doanh số",
    to: "/reports",
    roles: ["admin"],
  },
];

const DashBoard = () => {
  // const userData = JSON.parse(localStorage.getItem("user"));
  const { userInfo, setUserInfo } = useAppStore();
  const userRole = userInfo
    ? // ? userData.isAdmin
      userInfo.isAdmin
      ? "admin"
      : "employee"
    : "employee"; // Determine role based on isAdmin flag

  const filteredSidebarItems = sidebarItems.filter((item) =>
    item.roles.includes(userRole)
  );
  const handleLogout = async () => {
    try {
      const res = await apiClient.post(LOGOUT_ROUTE);
      if (res.status === 200 && res.data.status === 200) {
        setUserInfo(null);
        toast.success(res.data.message);
        // localStorage.removeItem("user");
        window.location.href = "/login";
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const [activeTab, setActiveTab] = useState(window.location.pathname);
  const location = useLocation();

  useEffect(() => {
    setActiveTab(location.pathname);
  }, [location.pathname]);

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full">
        <Sidebar>
          <SidebarHeader>
            <h2 className="text-xl font-bold">NB Pharmacy</h2>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu>
                  {filteredSidebarItems.map((item, index) => (
                    <SidebarMenuItem key={index}>
                      <Link
                        to={item?.to}
                        onClick={() => setActiveTab(item?.to)}
                      >
                        <SidebarMenuButton
                          className={
                            activeTab === item?.to
                              ? "bg-primary/10 text-primary font-medium"
                              : ""
                          }
                        >
                          <item.icon
                            className={`mr-2 h-4 w-4 ${
                              activeTab === item?.to ? "text-primary" : ""
                            }`}
                          />
                          {item.label}
                        </SidebarMenuButton>
                      </Link>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter className="border-t">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="w-full justify-start px-2">
                  <Avatar className="h-8 w-8 mr-2">
                    <AvatarImage src={userInfo?.avatar} alt={userInfo?.name} />
                    <AvatarFallback>
                      {userInfo?.name ? getInitials(userInfo?.name) : "AD"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col items-start">
                    <span className="text-sm font-medium">
                      {userInfo?.name}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {userRole === "admin" ? "Quản trị viên" : "Nhân viên"}
                    </span>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem asChild>
                  <Link to="/profile">
                    <User className="mr-2 h-4 w-4" />
                    <span>Hồ sơ</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/change-password">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Thay đổi mật khẩu</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Đăng xuất</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarFooter>
        </Sidebar>
        <div className="flex-1 overflow-auto">
          <Outlet />
        </div>
      </div>
    </SidebarProvider>
  );
};

export default DashBoard;
