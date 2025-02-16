import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select"; // Import chính xác
import InventoryMovement from "./components/InventoryMovement";
import ExpiringMedicines from "./components/ExpiringMedicines";
import ExpiredMedicines from "./components/ExpiredMedicines";
import DailyRevenue from "./components/DailyRevenue";
import MonthlyRevenue from "./components/MonthlyRevenue";
import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card.jsx";
import Header from "../component/Header.jsx";
import { Separator } from "@/components/ui/separator.jsx";

const Statistics = () => {
  const [selectedTab, setSelectedTab] = useState("inventory");

  const tabs = [
    {
      value: "inventory",
      label: "Thống kê nhập tồn theo ngày",
      component: <InventoryMovement />,
    },
    {
      value: "expiring",
      label: "Thuốc sắp hết hạn",
      component: <ExpiringMedicines />,
    },
    {
      value: "expired",
      label: "Thuốc đã hết hạn",
      component: <ExpiredMedicines />,
    },
    {
      value: "daily-revenue",
      label: "Doanh thu theo ngày",
      component: <DailyRevenue />,
    },
    {
      value: "monthly-revenue",
      label: "Doanh thu theo tháng",
      component: <MonthlyRevenue />,
    },
  ];

  return (
    <div>
      <Header title="Thống kê doanh số" />
      <main className="p-6">
        <Card>
          <CardHeader>
            <Select onValueChange={setSelectedTab} value={selectedTab}>
              <SelectTrigger className="w-[250px]">
                {tabs.find((tab) => tab.value === selectedTab)?.label}{" "}
              </SelectTrigger>
              <SelectContent>
                {tabs.map((tab) => (
                  <SelectItem key={tab.value} value={tab.value}>
                    {tab.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardHeader>
          <CardContent>
            <Separator />
            {tabs.find((tab) => tab.value === selectedTab)?.component}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Statistics;
