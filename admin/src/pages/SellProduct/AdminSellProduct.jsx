import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import CustomerSearch from "./components/CustomerSearch";
import PrescriptionInfo from "./components/PrescriptionInfo";
import MedicineSearch from "./components/MedicineSearch";
import Cart from "./components/Cart";
import Header from "../component/Header.jsx";
import Loading from "../component/Loading.jsx";

const SellMedicinePage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("prescription");
  const [customerType, setCustomerType] = useState("walkin");
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [cart, setCart] = useState([]);
  const [invoiceCreated, setInvoiceCreated] = useState(false);
  const [prescriptionInfo, setPrescriptionInfo] = useState({
    source: "",
    number: "",
  });

  return (
    <div>
      {isLoading && <Loading />}
      <Header title="Bán thuốc" />
      <main className="p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="prescription">Thuốc kê đơn</TabsTrigger>
            <TabsTrigger value="otc">Thuốc không kê đơn</TabsTrigger>
          </TabsList>
          <TabsContent value="prescription">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <CustomerSearch
                activeTab={activeTab}
                customerType={customerType}
                setCustomerType={setCustomerType}
                selectedCustomer={selectedCustomer}
                setSelectedCustomer={setSelectedCustomer}
                setCart={setCart}
                setInvoiceCreated={setInvoiceCreated}
                setPrescriptionInfo={setPrescriptionInfo}
              />
              {(customerType === "loyalty" || customerType === "walkin") && (
                <PrescriptionInfo
                  prescriptionInfo={prescriptionInfo}
                  setPrescriptionInfo={setPrescriptionInfo}
                />
              )}
            </div>
            <Card>
              <CardHeader>
                <CardTitle>Danh sách thuốc</CardTitle>
              </CardHeader>
              <CardContent>
                <MedicineSearch
                  activeTab={activeTab}
                  cart={cart}
                  setCart={setCart}
                  isPrescription={true}
                />
                <Cart
                  activeTab={activeTab}
                  cart={cart}
                  setCart={setCart}
                  customerType={customerType}
                  selectedCustomer={selectedCustomer}
                  prescriptionInfo={prescriptionInfo}
                  setInvoiceCreated={setInvoiceCreated}
                  invoiceCreated={invoiceCreated}
                  setIsLoading={setIsLoading}
                />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="otc">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <CustomerSearch
                activeTab={activeTab}
                customerType={customerType}
                setCustomerType={setCustomerType}
                selectedCustomer={selectedCustomer}
                setSelectedCustomer={setSelectedCustomer}
                setCart={setCart}
                setInvoiceCreated={setInvoiceCreated}
                setPrescriptionInfo={setPrescriptionInfo}
              />
            </div>
            <Card className="mt-4">
              <CardHeader>
                <CardTitle>Danh sách thuốc</CardTitle>
              </CardHeader>
              <CardContent>
                <MedicineSearch
                  activeTab={activeTab}
                  cart={cart}
                  setCart={setCart}
                  isPrescription={false}
                />
                <Cart
                  cart={cart}
                  activeTab={activeTab}
                  setCart={setCart}
                  customerType={customerType}
                  selectedCustomer={selectedCustomer}
                  prescriptionInfo={prescriptionInfo}
                  invoiceCreated={invoiceCreated}
                  setInvoiceCreated={setInvoiceCreated}
                  setIsLoading={setIsLoading}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default SellMedicinePage;
