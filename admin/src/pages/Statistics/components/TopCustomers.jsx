import { useEffect, useState } from "react";
import { apiClient } from "@/lib/api-admin";
import Loading from "@/pages/component/Loading.jsx";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { GET_TOP_CUSTOMERS_ROUTE } from "@/API/index.api.js";
import { convertVND } from "@/utils/convertVND.js";


const TopCustomers = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const res = await apiClient.get(GET_TOP_CUSTOMERS_ROUTE);
        if (res.status === 200) {
          setData(res.data.data);
        }
      } catch (error) {
        console.error("Error fetching top customers:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) return <Loading />;

  return (
    <div>
      <h2 className="text-lg font-bold mb-4">Khách hàng tiềm năng</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Tên khách hàng</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Số điện thoại</TableHead>
            <TableHead className="text-right">Tổng chi tiêu</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length > 0 ? (
            data.map((customer, index) => (
              <TableRow key={index}>
                <TableCell>{customer.customerName}</TableCell>
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
    </div>
  );
};

export default TopCustomers;
