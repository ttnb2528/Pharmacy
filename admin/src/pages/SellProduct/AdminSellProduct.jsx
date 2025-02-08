import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Header from "../component/Header";
import { Plus, Minus, Trash2, Printer, UserPlus } from "lucide-react";
import { Separator } from "@/components/ui/separator.jsx";

// Mock data for available medicines
const availableMedicines = [
  {
    id: 1,
    name: "Paracetamol",
    price: 5000,
    stock: 100,
    isPrescription: false,
    unit: "Viên",
  },
  {
    id: 2,
    name: "Amoxicillin",
    price: 10000,
    stock: 50,
    isPrescription: true,
    unit: "Viên",
  },
  {
    id: 3,
    name: "Omeprazole",
    price: 15000,
    stock: 75,
    isPrescription: true,
    unit: "Viên",
  },
  {
    id: 4,
    name: "Ibuprofen",
    price: 8000,
    stock: 80,
    isPrescription: false,
    unit: "Viên",
  },
  {
    id: 5,
    name: "Cetirizine",
    price: 12000,
    stock: 60,
    isPrescription: false,
    unit: "Viên",
  },
];

// Mock data for customers
const customers = [
  { id: 1, name: "Nguyễn Văn A", phone: "0123456789" },
  { id: 2, name: "Trần Thị B", phone: "0987654321" },
  { id: 3, name: "Lê Văn C", phone: "0369852147" },
];

const SellMedicinePage = () => {
  const [activeTab, setActiveTab] = useState("prescription");
  const [prescriptionSource, setPrescriptionSource] = useState("");

  const [prescriptionNumber, setPrescriptionNumber] = useState("");
  const [invoiceCreated, setInvoiceCreated] = useState(false);

  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [isNewCustomer, setIsNewCustomer] = useState(true);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const [cart, setCart] = useState([]);
  const [searchTermMedicine, setSearchTermMedicine] = useState("");
  const [searchResultsMedicine, setSearchResultsMedicine] = useState([]);
  const [showResultsMedicine, setShowResultsMedicine] = useState(false);
  const inputMedicineRef = useRef(null);
  const searchContainerMedicineRef = useRef(null);
  const [filterType, setFilterType] = useState("all");

  const [searchTermCus, setSearchTermCus] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const inputRef = useRef(null);
  const searchContainerRef = useRef(null);

  const addToCart = (medicine) => {
    const existingItem = cart.find((item) => item.id === medicine.id);
    if (existingItem) {
      setCart(
        cart.map((item) =>
          item.id === medicine.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setCart([...cart, { ...medicine, quantity: 1 }]);
    }

    setSearchTermMedicine("");
    setSearchResultsMedicine([]);
  };

  const removeFromCart = (id) => {
    setCart(cart.filter((item) => item.id !== id));
  };

  const updateQuantity = (id, quantity) => {
    setCart(
      cart.map((item) =>
        item.id === id ? { ...item, quantity: Number.parseInt(quantity) } : item
      )
    );
  };

  const filteredMedicines = availableMedicines.filter((medicine) => {
    if (activeTab === "prescription") {
      return (
        filterType === "all" ||
        (filterType === "prescription" && medicine.isPrescription) ||
        (filterType === "otc" && !medicine.isPrescription)
      );
    } else {
      return !medicine.isPrescription;
    }
  });

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  //   Invoice
  const handleCreateInvoice = () => {
    // Here you would typically send the data to your backend
    console.log("Creating invoice:", {
      customer: selectedCustomer,
      prescriptionSource,
      prescriptionNumber,
      cart,
      total,
    });
    setInvoiceCreated(true);
  };

  const handlePrintInvoice = () => {
    // Here you would typically generate a printable invoice
    console.log("Printing invoice");
  };

  //   Customer search
  const handleSearchChange = (event) => {
    const newSearchTerm = event.target.value;
    setSearchTermCus(newSearchTerm);

    if (!newSearchTerm) {
      setSearchResults([]);
      return;
    }

    const filteredCustomers = customers.filter((cus) => {
      return cus.name.toLowerCase().includes(newSearchTerm.toLowerCase());
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
      setIsNewCustomer(false);
      setSearchResults([]);
      setSearchTermCus("");
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      // Check if the click occurred outside the search container
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target)
      ) {
        setShowResults(false);
      }
    };

    // Listen for clicks on the document
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Clean up the event listener when the component is unmounted
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const renderCustomerSearch = () => (
    <Card className="max-w-xl">
      <CardHeader>
        <CardTitle>Thông tin khách hàng</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
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

          <Button>
            <UserPlus className="mr-2 h-4 w-4" />
            <span>Thêm mới</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  //   Medicine search
  const handleSearchMedicine = (event) => {
    const newSearchTerm = event.target.value;
    setSearchTermMedicine(newSearchTerm);

    if (!newSearchTerm) {
      setSearchResultsMedicine([]);
      return;
    }

    const filteredResult = filteredMedicines.filter((medicine) => {
      return medicine.name.toLowerCase().includes(newSearchTerm.toLowerCase());
    });
    setSearchResultsMedicine(filteredResult);
  };

  const handleFocusMedicine = () => {
    setShowResultsMedicine(true);
  };

  const handleMedicineSelect = (MedicineId) => {
    const selectedMedicine = availableMedicines.find(
      (c) => c.id === MedicineId
    );

    if (selectedMedicine) {
      addToCart(selectedMedicine);
    }
  };

  const renderPrescriptionInfo = () => (
    <Card>
      <CardHeader>
        <CardTitle>Thông tin đơn thuốc</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Input
            type="text"
            placeholder="Nơi khám"
            value={prescriptionSource}
            onChange={(e) => setPrescriptionSource(e.target.value)}
          />
          <Input
            type="text"
            placeholder="Số phiếu khám"
            value={prescriptionNumber}
            onChange={(e) => setPrescriptionNumber(e.target.value)}
          />
        </div>
      </CardContent>
    </Card>
  );

  //   Medicine

  const renderMedicineSearch = () => (
    <div className="mb-4">
      <div className="flex gap-2 mb-2 relative" ref={inputMedicineRef}>
        <Input
          type="text"
          placeholder="Tìm kiếm thuốc..."
          value={searchTermMedicine}
          onChange={handleSearchMedicine}
          onFocus={handleFocusMedicine}
        />
        {showResultsMedicine && (
          <div
            className="absolute top-12 left-0 w-[86%] bg-white rounded-md shadow-md search-suggestions z-50"
            ref={searchContainerMedicineRef}
          >
            <ul>
              {searchResultsMedicine.map((medicine) => (
                <li
                  key={medicine.id}
                  onClick={() => {
                    setShowResultsMedicine(false);
                  }}
                >
                  <div
                    className="py-2 px-4 hover:bg-gray-100 cursor-pointer"
                    onClick={() => handleMedicineSelect(medicine.id)}
                  >
                    <span>{medicine.name}</span>
                  </div>
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
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Mã</TableHead>
            <TableHead>Tên thuốc</TableHead>
            <TableHead>Thuốc kê đơn?</TableHead>
            <TableHead>Đơn vị tính</TableHead>
            <TableHead>Số lượng</TableHead>
            <TableHead>Đơn giá</TableHead>
            <TableHead>Thành tiền</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {cart.map((medicine) => (
            <TableRow key={medicine.id}>
              <TableCell>{medicine.id}</TableCell>
              <TableCell>{medicine.name}</TableCell>
              <TableCell>{medicine.isPrescription ? "Có" : "Không"}</TableCell>
              <TableCell>{medicine.unit}</TableCell>
              <TableCell>
                <div className="flex items-center">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      updateQuantity(
                        medicine.id,
                        (cart.find((item) => item.id === medicine.id)
                          ?.quantity || 0) - 1
                      )
                    }
                    disabled={
                      !cart.find((item) => item.id === medicine.id) ||
                      cart.find((item) => item.id === medicine.id)?.quantity <=
                        1
                    }
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <Input
                    type="number"
                    value={
                      cart.find((item) => item.id === medicine.id)?.quantity ||
                      0
                    }
                    onChange={(e) =>
                      updateQuantity(medicine.id, e.target.value)
                    }
                    className="w-16 mx-2 text-center"
                    min="0"
                    max={medicine.stock}
                  />
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => addToCart(medicine)}
                    disabled={
                      cart.find((item) => item.id === medicine.id)?.quantity >=
                      medicine.stock
                    }
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
              <TableCell>{medicine.price.toLocaleString()} VND</TableCell>
              <TableCell>
                {(
                  (cart.find((item) => item.id === medicine.id)?.quantity ||
                    0) * medicine.price
                ).toLocaleString()}{" "}
                VND
              </TableCell>
              <TableCell>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => removeFromCart(medicine.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Separator />
      <div className="mt-4">
        <div className="flex items-center justify-between mb-4">
          <span className="font-semibold">Tổng cộng</span>
          {cart && cart.length > 0 && (
            <p className="text-2xl font-bold text-red-500">
              {total.toLocaleString()} VND
            </p>
          )}
        </div>
        <div>
          <div className="flex gap-2">
            {cart && cart.length > 0 && 
              prescriptionNumber &&
              prescriptionSource &&
              selectedCustomer && (
                <Button onClick={handleCreateInvoice} disabled={invoiceCreated}>
                  Tạo hóa đơn
                </Button>
              )}

            {invoiceCreated && (
              <Button onClick={handlePrintInvoice}>
                <Printer className="mr-2 h-4 w-4" /> In hóa đơn
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto p-4">
      <Header title="Bán thuốc" />
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="prescription">Thuốc kê đơn</TabsTrigger>
          <TabsTrigger value="otc">Thuốc không kê đơn</TabsTrigger>
        </TabsList>
        <TabsContent value="prescription">
          <div className="relative" ref={inputRef}>
            <Input
              className="w-96 h-10 rounded-lg bg-white focus-visible:ring-0 p-2 outline-none my-2"
              placeholder="Tìm kiếm khách hàng..."
              value={searchTermCus}
              onChange={handleSearchChange}
              onFocus={handleFocus}
            />
            {showResults && (
              <div
                className="absolute top-12 left-0 w-96 bg-white rounded-md shadow-md search-suggestions"
                ref={searchContainerRef}
              >
                <ul>
                  {searchResults.map((cus) => (
                    <li
                      key={cus.id}
                      onClick={() => {
                        setShowResults(false);
                      }}
                    >
                      <div
                        className="py-2 px-4 hover:bg-gray-100 cursor-pointer"
                        onClick={() => handleCustomerSelect(cus.id)}
                      >
                        <span>
                          {cus.name} - {cus.phone}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {renderCustomerSearch()}
            {renderPrescriptionInfo()}
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Danh sách thuốc</CardTitle>
            </CardHeader>
            <CardContent>{renderMedicineSearch()}</CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="otc">
          <div className="relative" ref={inputRef}>
            <Input
              className="w-96 h-10 rounded-lg bg-white focus-visible:ring-0 p-2 outline-none my-2"
              placeholder="Tìm kiếm khách hàng..."
              value={searchTermCus}
              onChange={handleSearchChange}
              onFocus={handleFocus}
            />
            {showResults && (
              <div
                className="absolute top-12 left-0 w-96 bg-white rounded-md shadow-md search-suggestions"
                ref={searchContainerRef}
              >
                <ul>
                  {searchResults.map((cus) => (
                    <li
                      key={cus.id}
                      onClick={() => {
                        setShowResults(false);
                      }}
                    >
                      <div
                        className="py-2 px-4 hover:bg-gray-100 cursor-pointer"
                        onClick={() => handleCustomerSelect(cus.id)}
                      >
                        <span>
                          {cus.name} - {cus.phone}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          {renderCustomerSearch()}
          <Card className="mt-4">
            <CardHeader>
              <CardTitle>Danh sách thuốc</CardTitle>
            </CardHeader>
            <CardContent>{renderMedicineSearch()}</CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SellMedicinePage;
