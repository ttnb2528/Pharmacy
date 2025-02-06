"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Header from "../component/Header"
import { Plus, Minus, Trash2, Printer, UserPlus, X } from "lucide-react"

// Mock data for available medicines
const availableMedicines = [
  { id: 1, name: "Paracetamol", price: 5000, stock: 100, isPrescription: false, unit: "Viên" },
  { id: 2, name: "Amoxicillin", price: 10000, stock: 50, isPrescription: true, unit: "Viên" },
  { id: 3, name: "Omeprazole", price: 15000, stock: 75, isPrescription: true, unit: "Viên" },
  { id: 4, name: "Ibuprofen", price: 8000, stock: 80, isPrescription: false, unit: "Viên" },
  { id: 5, name: "Cetirizine", price: 12000, stock: 60, isPrescription: false, unit: "Viên" },
]

// Mock data for customers
const customers = [
  { id: 1, name: "Nguyễn Văn A", phone: "0123456789" },
  { id: 2, name: "Trần Thị B", phone: "0987654321" },
  { id: 3, name: "Lê Văn C", phone: "0369852147" },
]

const SellMedicinePage = () => {
  const [activeTab, setActiveTab] = useState("prescription")
  const [cart, setCart] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [customerSearch, setCustomerSearch] = useState("")
  const [selectedCustomer, setSelectedCustomer] = useState(null)
  const [prescriptionSource, setPrescriptionSource] = useState("")
  const [prescriptionNumber, setPrescriptionNumber] = useState("")
  const [invoiceCreated, setInvoiceCreated] = useState(false)
  const [customerName, setCustomerName] = useState("")
  const [customerPhone, setCustomerPhone] = useState("")
  const [isNewCustomer, setIsNewCustomer] = useState(true)
  const [hasSearched, setHasSearched] = useState(false)
  const [customerSearchResults, setCustomerSearchResults] = useState([])

  useEffect(() => {
    if (customerSearch) {
      const filtered = customers.filter(
        (customer) =>
          customer.name.toLowerCase().includes(customerSearch.toLowerCase()) || customer.phone.includes(customerSearch),
      )
      setCustomerSearchResults(filtered)
    } else {
      setCustomerSearchResults([])
    }
  }, [customerSearch])

  const addToCart = (medicine) => {
    const existingItem = cart.find((item) => item.id === medicine.id)
    if (existingItem) {
      setCart(cart.map((item) => (item.id === medicine.id ? { ...item, quantity: item.quantity + 1 } : item)))
    } else {
      setCart([...cart, { ...medicine, quantity: 1 }])
    }
  }

  const removeFromCart = (id) => {
    setCart(cart.filter((item) => item.id !== id))
  }

  const updateQuantity = (id, quantity) => {
    setCart(cart.map((item) => (item.id === id ? { ...item, quantity: Number.parseInt(quantity) } : item)))
  }

  const filteredMedicines = availableMedicines.filter(
    (medicine) =>
      medicine.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (filterType === "all" ||
        (filterType === "prescription" && medicine.isPrescription) ||
        (filterType === "otc" && !medicine.isPrescription)),
  )

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(customerSearch.toLowerCase()) || customer.phone.includes(customerSearch),
  )

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)

  const handleCreateInvoice = () => {
    // Here you would typically send the data to your backend
    console.log("Creating invoice:", {
      customer: selectedCustomer,
      prescriptionSource,
      prescriptionNumber,
      cart,
      total,
    })
    setInvoiceCreated(true)
  }

  const handlePrintInvoice = () => {
    // Here you would typically generate a printable invoice
    console.log("Printing invoice")
  }

  const handleAddCustomer = () => {
    if (customerName && customerPhone) {
      const newCustomer = {
        id: customers.length + 1,
        name: customerName,
        phone: customerPhone,
      }
      customers.push(newCustomer)
      setSelectedCustomer(newCustomer)
      setIsNewCustomer(false)
    }
  }

  const clearCustomerInfo = () => {
    setCustomerName("")
    setCustomerPhone("")
    setSelectedCustomer(null)
    setIsNewCustomer(true)
  }

  const handleCustomerSelect = (customerId) => {
    const selectedCustomer = customers.find((c) => c.id.toString() === customerId)
    if (selectedCustomer) {
      setSelectedCustomer(selectedCustomer)
      setCustomerName(selectedCustomer.name)
      setCustomerPhone(selectedCustomer.phone)
      setIsNewCustomer(false)
      setCustomerSearch("")
    }
  }

  const renderCustomerSearch = () => (
    <Card>
      <CardHeader>
        <CardTitle>Thông tin khách hàng</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex gap-2">
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
          <div className="flex gap-2">
            <Select onValueChange={handleCustomerSelect}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Tìm kiếm khách hàng..." />
              </SelectTrigger>
              <SelectContent>
                <Input
                  type="text"
                  placeholder="Tìm kiếm..."
                  value={customerSearch}
                  onChange={(e) => setCustomerSearch(e.target.value)}
                  className="mb-2"
                />
                {customerSearchResults.map((customer) => (
                  <SelectItem key={customer.id} value={customer.id.toString()}>
                    {customer.name} - {customer.phone}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {isNewCustomer ? (
              <Button onClick={handleAddCustomer}>
                <UserPlus className="mr-2 h-4 w-4" /> Thêm khách hàng mới
              </Button>
            ) : (
              <Button onClick={clearCustomerInfo}>
                <X className="mr-2 h-4 w-4" /> Xóa thông tin
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )

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
  )

  const renderMedicineSearch = () => (
    <div className="mb-4">
      <div className="flex gap-2 mb-2">
        <Input
          type="text"
          placeholder="Tìm kiếm thuốc..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value)
            setHasSearched(true)
          }}
        />
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
      {hasSearched ? (
        filteredMedicines.length > 0 ? (
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
              {filteredMedicines.map((medicine) => (
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
                          updateQuantity(medicine.id, (cart.find((item) => item.id === medicine.id)?.quantity || 0) - 1)
                        }
                        disabled={
                          !cart.find((item) => item.id === medicine.id) ||
                          cart.find((item) => item.id === medicine.id)?.quantity <= 1
                        }
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <Input
                        type="number"
                        value={cart.find((item) => item.id === medicine.id)?.quantity || 0}
                        onChange={(e) => updateQuantity(medicine.id, e.target.value)}
                        className="w-16 mx-2 text-center"
                        min="0"
                        max={medicine.stock}
                      />
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => addToCart(medicine)}
                        disabled={cart.find((item) => item.id === medicine.id)?.quantity >= medicine.stock}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell>{medicine.price.toLocaleString()} VND</TableCell>
                  <TableCell>
                    {((cart.find((item) => item.id === medicine.id)?.quantity || 0) * medicine.price).toLocaleString()}{" "}
                    VND
                  </TableCell>
                  <TableCell>
                    <Button variant="destructive" size="sm" onClick={() => removeFromCart(medicine.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <p className="text-center py-4">Không tìm thấy thuốc phù hợp.</p>
        )
      ) : (
        <p className="text-center py-4">Nhập tên thuốc để tìm kiếm.</p>
      )}
    </div>
  )

  return (
    <div className="container mx-auto p-4">
      <Header title="Bán thuốc" />
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="prescription">Thuốc kê đơn</TabsTrigger>
          <TabsTrigger value="otc">Thuốc không kê đơn</TabsTrigger>
        </TabsList>
        <TabsContent value="prescription">
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
          {renderCustomerSearch()}
          <Card className="mt-4">
            <CardHeader>
              <CardTitle>Danh sách thuốc</CardTitle>
            </CardHeader>
            <CardContent>{renderMedicineSearch()}</CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      <Card className="mt-4">
        <CardHeader>
          <CardTitle>Tổng cộng</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold mb-4">{total.toLocaleString()} VND</p>
          <div className="flex gap-2">
            <Button onClick={handleCreateInvoice} disabled={invoiceCreated}>
              Tạo hóa đơn
            </Button>
            {invoiceCreated && (
              <Button onClick={handlePrintInvoice}>
                <Printer className="mr-2 h-4 w-4" /> In hóa đơn
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default SellMedicinePage

