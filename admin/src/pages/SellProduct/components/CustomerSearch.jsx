import { useState, useEffect, useRef, useContext } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UserPlus, X } from "lucide-react";
import { SellProductContext } from "@/context/SellProductContext.context.jsx";
import { apiClient } from "@/lib/api-admin"; // Import API client
import { ADD_CUSTOMER_ROUTE } from "@/API/index.api"; // Import route

// Mock data for customers
// const customers = [
//   { id: 1, name: "Nguyễn Văn A", phone: "0123456789" },
//   { id: 2, name: "Trần Thị B", phone: "0987654321" },
//   { id: 3, name: "Lê Văn C", phone: "0369852147" },
// ];

const CustomerSearch = ({
  customerType,
  setCustomerType,
  selectedCustomer,
  setSelectedCustomer,
  setCart,
  setInvoiceCreated,
  setPrescriptionInfo,
  activeTab,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const inputRef = useRef(null);
  const searchContainerRef = useRef(null);

  const { customers } = useContext(SellProductContext);

  useEffect(() => {
    if (activeTab) {
      setCustomerName("");
      setCustomerPhone("");
      setSelectedCustomer(null);
      setCart([]);
      setInvoiceCreated(false);
      setPrescriptionInfo({ source: "", number: "" });
    }
  }, [activeTab]);

  const handleSearchChange = (event) => {
    const newSearchTerm = event.target.value;
    setSearchTerm(newSearchTerm);

    if (!newSearchTerm) {
      setSearchResults([]);
      return;
    }

    const filteredCustomers = customers.filter((cus) => {
      if (!cus) return false;

      const nameMatch =
        cus.name &&
        typeof cus.name === "string" &&
        cus.name.toLowerCase().includes(newSearchTerm.toLowerCase());

      const phoneMatch =
        cus.phone && cus.phone.toString().includes(newSearchTerm);

      return nameMatch || phoneMatch;
    });
    setSearchResults(filteredCustomers);
  };

  const handleFocus = () => {
    setShowResults(true);
  };

  const handleCustomerSelect = (customerId) => {
    const selectedCustomer = customers.find((c) => c.id === customerId);

    if (selectedCustomer) {
      setSelectedCustomer(selectedCustomer);
      setCustomerName(selectedCustomer.name);
      setCustomerPhone(selectedCustomer.phone);
      setSearchResults([]);
      setSearchTerm("");
    }
  };

  const handleAddCustomer = async () => {
    // Validate số điện thoại Việt Nam
    const phoneRegex = /^[0-9]{10}$/; // Số điện thoại phải có đúng 10 chữ số
    if (!phoneRegex.test(customerPhone)) {
      alert("Số điện thoại không hợp lệ. Vui lòng nhập số điện thoại có 10 chữ số.");
      return;
    }

    if (customerName && customerPhone) {
      try {
        const response = await apiClient.post(ADD_CUSTOMER_ROUTE, {
          name: customerName || "Khách hàng", // Nếu không có tên, đặt mặc định là "Khách hàng"
          phone: customerPhone,
        });

        if (response.status === 201 || response.data.status === 201) {
          const newCustomer = response.data.data; // Lấy thông tin khách hàng từ API
          setSelectedCustomer(newCustomer);
          setCustomerType("loyalty");
          alert("Thêm khách hàng thành công!");
        } else {
          alert(response.data.message || "Không thể thêm khách hàng");
        }
      } catch (error) {
        console.error("Error adding customer:", error);
        alert("Đã xảy ra lỗi khi thêm khách hàng");
      }
    } else {
      alert("Vui lòng nhập đầy đủ thông tin khách hàng");
    }
  };

  const clearCustomerInfo = () => {
    setCustomerName("");
    setCustomerPhone("");
    setSelectedCustomer(null);
    // setCustomerType("walkin");
    setCart([]);
    setInvoiceCreated(false);
    setPrescriptionInfo({ source: "", number: "" });
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
    <Card>
      <CardHeader>
        <CardTitle>Thông tin khách hàng</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Select value={customerType} onValueChange={setCustomerType}>
            <SelectTrigger>
              <SelectValue placeholder="Loại khách hàng" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="walkin">Khách vãng lai</SelectItem>
              <SelectItem value="loyalty">Khách tích điểm</SelectItem>
              <SelectItem value="business">Khách doanh nghiệp</SelectItem>
            </SelectContent>
          </Select>

          {customerType !== "walkin" && (
            <>
              <div className="relative">
                <Input
                  ref={inputRef}
                  placeholder="Tìm kiếm khách hàng..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  onFocus={handleFocus}
                />
                {showResults && (
                  <div
                    className="absolute top-12 left-0 w-full bg-white rounded-md shadow-md search-suggestions z-10"
                    ref={searchContainerRef}
                  >
                    <ul>
                      {searchResults.map((cus) => (
                        <li
                          key={cus.id}
                          className="py-2 px-4 hover:bg-gray-100 cursor-pointer"
                          onClick={() => {
                            handleCustomerSelect(cus.id);
                            setShowResults(false);
                          }}
                        >
                          <span>
                            {cus.name} - {cus.phone}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              <div className="grid gap-2">
                <Input
                  type="text"
                  placeholder="Tên khách hàng"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                />
                <Input
                  type="tel"
                  placeholder="Số điện thoại"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                />
              </div>
              {selectedCustomer ? (
                <Button onClick={clearCustomerInfo}>
                  <X className="mr-2 h-4 w-4" />
                  <span>Xóa thông tin</span>
                </Button>
              ) : (
                <Button onClick={handleAddCustomer}>
                  <UserPlus className="mr-2 h-4 w-4" />
                  <span>Thêm mới</span>
                </Button>
              )}
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CustomerSearch;
