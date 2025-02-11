"use client";

import { useState, useRef, useEffect, useContext } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SellProductContext } from "@/context/SellProductContext.context.jsx";
import { toast } from "sonner";

// Mock data for available medicines
// const availableMedicines = [
//   {
//     id: 1,
//     name: "Paracetamol",
//     price: 5000,
//     stock: 100,
//     isPrescription: false,
//     unit: "Viên",
//   },
//   {
//     id: 2,
//     name: "Amoxicillin",
//     price: 10000,
//     stock: 50,
//     isPrescription: true,
//     unit: "Viên",
//   },
//   {
//     id: 3,
//     name: "Omeprazole",
//     price: 15000,
//     stock: 75,
//     isPrescription: true,
//     unit: "Viên",
//   },
//   {
//     id: 4,
//     name: "Ibuprofen",
//     price: 8000,
//     stock: 80,
//     isPrescription: false,
//     unit: "Viên",
//   },
//   {
//     id: 5,
//     name: "Cetirizine",
//     price: 12000,
//     stock: 60,
//     isPrescription: false,
//     unit: "Viên",
//   },
// ];

const MedicineSearch = ({ activeTab, cart, setCart, isPrescription }) => {
  const { allProducts } = useContext(SellProductContext);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [filterType, setFilterType] = useState("all");
  const inputRef = useRef(null);
  const searchContainerRef = useRef(null);

  const handleSearchChange = (event) => {
    const newSearchTerm = event.target.value;
    setSearchTerm(newSearchTerm);

    if (!newSearchTerm) {
      setSearchResults([]);
      return;
    }

    const filteredMedicines = allProducts.filter((medicine) => {
      const matchesSearch = medicine.name
        .toLowerCase()
        .includes(newSearchTerm.toLowerCase());
      const matchesFilter =
        filterType === "all" ||
        (filterType === "prescription" && medicine.isRx) ||
        (filterType === "otc" && !medicine.isRx);
      return (
        matchesSearch && matchesFilter && (isPrescription || !medicine.isRx)
      );
    });
    setSearchResults(filteredMedicines);
  };

  const handleFocus = () => {
    setShowResults(true);
  };

  const handleMedicineSelect = (medicineId) => {
    const selectedMedicine = allProducts.find((m) => m.id === medicineId);
    if (selectedMedicine) {
      if (selectedMedicine.quantityStock > 0) {
        // Kiểm tra số lượng tồn kho
        // Thêm thuốc vào giỏ hàng
        const existingItem = cart.find(
          (item) => item.id === selectedMedicine.id
        );
        if (existingItem) {
          setCart(
            cart.map((item) =>
              item.id === selectedMedicine.id
                ? { ...item, quantity: item.quantity + 1 }
                : item
            )
          );
        } else {
          setCart([...cart, { ...selectedMedicine, quantity: 1 }]);
        }
        setSearchTerm("");
        setSearchResults();
      } else {
        // Hiển thị thông báo "Hết hàng"
        toast.warning(`Thuốc ${selectedMedicine.name} đã hết hàng!`);
      }
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target) &&
        event.target !== inputRef.current
      ) {
        setShowResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="mb-4">
      <div className="flex gap-2 mb-2 relative">
        <Input
          ref={inputRef}
          type="text"
          placeholder="Tìm kiếm thuốc..."
          value={searchTerm}
          onChange={handleSearchChange}
          onFocus={handleFocus}
        />
        {showResults && searchResults && Array.isArray(searchResults) && (
          <div
            className="absolute top-12 left-0 w-full bg-white rounded-md shadow-md search-suggestions z-10 max-h-60 overflow-y-auto"
            ref={searchContainerRef}
          >
            <ul>
              {searchResults.map((medicine) => (
                <li
                  key={medicine.id}
                  className="py-2 px-4 hover:bg-gray-100 cursor-pointer"
                  onClick={() => {
                    handleMedicineSelect(medicine.id);
                    setShowResults(false);
                  }}
                >
                  <span>{medicine.name}</span>
                  {medicine.quantityStock === 0 && (
                    <span className="text-red-500 ml-2 text-sm">
                      (Hết hàng)
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
        {activeTab === "prescription" && (
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Loại thuốc" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả</SelectItem>
              <SelectItem value="prescription">Thuốc kê đơn</SelectItem>
              <SelectItem value="otc">Thuốc không kê đơn</SelectItem>
            </SelectContent>
          </Select>
        )}
      </div>
    </div>
  );
};

export default MedicineSearch;
