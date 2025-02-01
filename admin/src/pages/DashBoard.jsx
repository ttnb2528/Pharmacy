import {
  Activity,
  Box,
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
  { icon: Home, label: "Tổng quan", to: "/" },
  { icon: Pill, label: "Quản lý thuốc", to: "/products" },
  { icon: Users, label: "Tài khoản", to: "/accounts" },
  { icon: Box, label: "Lô hàng", to: "/batches" },
  { icon: Tag, label: "Thương hiệu", to: "/brands" },
  { icon: Layers, label: "Danh mục", to: "/categories" },
  { icon: DollarSign, label: "Mã giảm giá", to: "/coupons" },
  { icon: Users, label: "Khách hàng", to: "/customers" },
  { icon: Users, label: "Nhân viên", to: "/employees" },
  { icon: Truck, label: "Nhà sản xuất", to: "/manufacturers" },
  { icon: ShoppingCart, label: "Đơn hàng", to: "/orders" },
  { icon: Calendar, label: "Giờ làm", to: "/schedules" },
  { icon: Truck, label: "Nhà cung cấp", to: "/suppliers" },
  { icon: Activity, label: "Thống kê doanh số", to: "/reports" },
];

const DashBoard = () => {
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
                  {sidebarItems.map((item, index) => (
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
