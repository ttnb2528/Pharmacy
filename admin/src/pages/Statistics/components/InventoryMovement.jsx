import { useEffect, useMemo, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { format } from "date-fns";
import { Input } from "@/components/ui/input.jsx";
import { formatDate } from "@/utils/formatDate.js";
import { apiClient } from "@/lib/api-admin.js";
import { GET_ALL_BATCHES_FOR_STATISTICS_ROUTE } from "@/API/index.api.js";
import Loading from "@/pages/component/Loading.jsx";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select.jsx";
import * as XLSX from "xlsx";
import CustomPagination from "@/pages/component/Pagination.jsx";

const InventoryMovement = () => {
  const [date, setDate] = useState({
    from: new Date(),
    to: new Date(),
  });
  const [groupedData, setGroupedData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch dữ liệu khi `date` thay đổi
  useEffect(() => {
    const fetchBatches = async () => {
      try {
        setIsLoading(true);
        const response = await apiClient.get(
          `${GET_ALL_BATCHES_FOR_STATISTICS_ROUTE}?from=${date.from.toISOString()}&to=${date.to.toISOString()}`
        );
        if (response.status === 200 && response.data.status === 200) {
          const data = response.data.data;

          // Xử lý group data theo tên thuốc và ngày nhập
          const grouped = data.reduce((acc, item) => {
            const medicineName = item?.MedicineId.name;
            const entryDate = formatDate(item.createdAt);
            const key = `${medicineName}_${entryDate}`;

            if (!acc[key]) {
              acc[key] = {
                name: medicineName,
                quantity: 0,
                stock: item.MedicineId.quantityStock,
                dateOfEntry: item.createdAt,
              };
            }
            acc[key].quantity += item.quantity;
            return acc;
          }, {});

          setGroupedData(Object.values(grouped));
        }
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBatches();
  }, [date]);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const totalPages = Math.ceil(groupedData.length / itemsPerPage);
  const paginatedResult = useMemo(() => {
    return groupedData.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    );
  }, [groupedData, currentPage, itemsPerPage]);

  const exportToExcel = () => {
    const excelData = groupedData.map((item) => ({
      "Tên thuốc": item.name,
      "Ngày nhập": formatDate(item.dateOfEntry),
      "Số lượng": item.quantity,
      "Tồn kho": item.stock,
    }));
    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Inventory Movement");
    XLSX.writeFile(
      workbook,
      `inventory_movement_${format(new Date(), "yyyy-MM-dd")}.xlsx`
    );
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col justify-between gap-5 mb-4">
        <span className="text-2xl font-bold">Thống kê xuất nhập tồn</span>

        <div className="flex justify-between">
          <div className="flex items-center space-x-4">
            <span className="font-semibold">Chọn ngày bắt đầu</span>
            <Input
              type="date"
              className="w-auto"
              value={format(date.from, "yyyy-MM-dd")}
              onChange={(e) =>
                setDate({ ...date, from: new Date(e.target.value) })
              }
            />
            <span className="font-semibold">Chọn ngày kết thúc</span>
            <Input
              type="date"
              className="w-auto"
              value={format(date.to, "yyyy-MM-dd")}
              onChange={(e) =>
                setDate({ ...date, to: new Date(e.target.value) })
              }
            />
          </div>

          {groupedData.length > 0 && (
            <div className="flex items-center space-x-4">
              <Select value={itemsPerPage} onValueChange={setItemsPerPage}>
                <SelectTrigger className="w-[150px]">
                  {itemsPerPage} mục/trang
                </SelectTrigger>
                <SelectContent>
                  {[10, 15, 20].map((item) => (
                    <SelectItem key={item} value={item}>
                      {item} mục/trang
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <button
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                onClick={exportToExcel}
              >
                Xuất file
              </button>
            </div>
          )}
        </div>

        {groupedData.length > 0 && (
          <div>
            Kết quả: <span className="font-semibold">{groupedData.length}</span>{" "}
            mục
          </div>
        )}
      </div>

      {groupedData.length > 0 ? (
        <>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tên thuốc</TableHead>
                <TableHead>Ngày nhập</TableHead>
                <TableHead>Số lượng</TableHead>
                <TableHead>Tồn kho</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedResult.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{formatDate(item.dateOfEntry)}</TableCell>
                  <TableCell>{item.quantity}</TableCell>
                  <TableCell>{item.stock}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <CustomPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </>
      ) : (
        <p className="text-center text-lg text-muted-foreground">
          Không có dữ liệu xuất nhập tồn trong khoảng thời gian này.
        </p>
      )}

      {isLoading && <Loading />}
    </div>
  );
};

export default InventoryMovement;
