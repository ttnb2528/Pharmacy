import { GET_ALL_SUPPLIERS_ROUTE } from "@/API/index.api.js";
import { apiClient } from "@/lib/api-admin.js";
import { createContext, useEffect, useState } from "react";

export const SupplierContext = createContext();

const SupplierContextProvider = (props) => {
  const [suppliers, setSuppliers] = useState([]);

  useEffect(() => {
    const getCategories = async () => {
      const res = await apiClient.get(GET_ALL_SUPPLIERS_ROUTE);

      if (res.status === 200 && res.data.status === 200) {
        setSuppliers(res.data.data);
      }
    };

    getCategories();
  }, []);

  const contextValue = {
    suppliers,
    setSuppliers,
  };
  return (
    <SupplierContext.Provider value={contextValue}>
      {props.children}
    </SupplierContext.Provider>
  );
};

export default SupplierContextProvider;
