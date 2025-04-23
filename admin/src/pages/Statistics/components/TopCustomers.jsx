import { useEffect, useState } from "react";
import { apiClient } from "@/lib/api-admin";
import Loading from "@/pages/component/Loading.jsx";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LabelList,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { GET_TOP_CUSTOMERS_ROUTE } from "@/API/index.api";
import { convertVND } from "@/utils/convertVND";
import { AlertCircle, BarChart3, Table2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const TopCustomers = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await apiClient.get(GET_TOP_CUSTOMERS_ROUTE);

        if (res.status === 200 && res.data.status === 200) {
          setData(res.data.data);
        } else {
          setError("Không thể tải dữ liệu khách hàng");
        }
      } catch (error) {
        console.error("Error fetching top customers:", error);
        setError("Đã xảy ra lỗi khi tải dữ liệu");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) return <Loading />;

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Lỗi</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  // Prepare data for chart
  const chartData = [...data]
    .sort((a, b) => b.totalSpending - a.totalSpending)
    .map((customer) => {
      const displayName =
        customer.customerName ||
        customer.username ||
        (customer.email ? customer.email.split("@")[0] : "Khách hàng");

      return {
        name:
          displayName.length > 15
            ? displayName.substring(0, 15) + "..."
            : displayName,
        value: customer.totalSpending,
        formattedValue: convertVND(customer.totalSpending),
        fullName: displayName,
        email: customer.email || "Không có",
        phone: customer.customerPhone || "Không có",
      };
    });

  // Get initials for avatar
  const getInitials = (name) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  console.log(chartData);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const customer = payload[0].payload;
      return (
        <div className="bg-white p-3 border rounded-md shadow-md">
          <p className="font-medium">{customer.fullName}</p>
          <p className="text-sm">{customer.email}</p>
          <p className="text-sm">{customer.phone}</p>
          <p className="text-sm font-medium mt-1">
            Tổng chi tiêu: {customer.formattedValue}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Khách hàng tiềm năng</CardTitle>
        <CardDescription>
          Top 10 khách hàng có tổng chi tiêu cao nhất
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="chart">
          <TabsList className="mb-4">
            <TabsTrigger value="chart">
              <BarChart3 className="h-4 w-4 mr-2" />
              Biểu đồ
            </TabsTrigger>
            <TabsTrigger value="table">
              <Table2 className="h-4 w-4 mr-2" />
              Bảng
            </TabsTrigger>
          </TabsList>

          <TabsContent value="chart">
            {data.length === 0 ? (
              <div className="flex justify-center items-center h-64 text-muted-foreground">
                Không có dữ liệu khách hàng
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={400}>
                <BarChart
                  data={chartData}
                  layout="vertical"
                  margin={{ top: 20, right: 30, left: 40, bottom: 5 }}
                >
                  <XAxis
                    type="number"
                    tickFormatter={(value) => convertVND(value)}
                  />
                  <YAxis
                    dataKey="name"
                    type="category"
                    width={150}
                    tick={{ fontSize: 12 }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar
                    dataKey="value"
                    fill="#7c3aed"
                    radius={[0, 4, 4, 0]}
                    barSize={20}
                  >
                    <LabelList
                      dataKey="formattedValue"
                      position="right"
                      style={{ fontSize: "12px", fill: "#6b7280" }}
                    />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </TabsContent>

          <TabsContent value="table">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Khách hàng</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Số điện thoại</TableHead>
                  <TableHead className="text-right">Tổng chi tiêu</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.length > 0 ? (
                  data.map((customer, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8 bg-primary/10">
                            <AvatarFallback className="text-xs">
                              {getInitials(customer.customerName)}
                            </AvatarFallback>
                          </Avatar>
                          <span>{customer.customerName}</span>
                        </div>
                      </TableCell>
                      <TableCell>{customer.email}</TableCell>
                      <TableCell>{customer.customerPhone}</TableCell>
                      <TableCell className="text-right font-medium">
                        {convertVND(customer.totalSpending)}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-4">
                      Không có dữ liệu khách hàng
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default TopCustomers;
