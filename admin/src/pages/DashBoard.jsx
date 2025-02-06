import {
  Activity,
  Calendar,
  DollarSign,
  Home,
  Layers,
  //   Package,
  Pill,
  //   ShoppingBag,
  ShoppingCart,
  Tag,
  Truck,
  Users,
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
  //   SidebarTrigger,
} from "@/components/ui/sidebar";
import { Link, Outlet } from "react-router-dom";

const sidebarItems = [
  { icon: Home, label: "Tổng quan", to: "/", roles: ["admin", "employee"] },
  {
    icon: Pill,
    label: "Quản lý thuốc",
    to: "/products",
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
    icon: Activity,
    label: "Thống kê doanh số",
    to: "/reports",
    roles: ["admin"],
  },
];

const DashBoard = () => {
  const userData = JSON.parse(localStorage.getItem("user"));
  const userRole = userData
    ? userData.isAdmin
      ? "admin"
      : "employee"
    : "employee"; // Determine role based on isAdmin flag

  const filteredSidebarItems = sidebarItems.filter((item) =>
    item.roles.includes(userRole)
  );
  
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
                      <Link to={item?.to}>
                        <SidebarMenuButton>
                          <item.icon className="mr-2 h-4 w-4" />
                          {item.label}
                        </SidebarMenuButton>
                      </Link>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>
        <div className="flex-1 overflow-auto">
          <Outlet />
        </div>
      </div>
    </SidebarProvider>
  );
};

export default DashBoard;
