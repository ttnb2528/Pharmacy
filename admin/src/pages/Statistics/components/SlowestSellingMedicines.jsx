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
import { GET_SLOWEST_SELLING_MEDICINES_ROUTE } from "@/API/index.api.js";

const SlowestSellingMedicines = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const res = await apiClient.get(
            GET_SLOWEST_SELLING_MEDICINES_ROUTE
        );
        if (res.status === 200) {
          setData(res.data.data);
        }
      } catch (error) {
        console.error("Error fetching slowest-selling medicines:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) return <Loading />;

  return (
    <div>
      <h2 className="text-lg font-bold mb-4">Thuốc bán chậm nhất</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Tên thuốc</TableHead>
            <TableHead>Số lượng bán</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((medicine, index) => (
            <TableRow key={index}>
              <TableCell>{medicine.name}</TableCell>
              <TableCell>{medicine.sold}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default SlowestSellingMedicines;
