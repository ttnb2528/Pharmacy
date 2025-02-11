import {
  GET_ALL_CUSTOMERS_ROUTE,
  GET_ALL_PRODUCTS_ROUTE,
} from "@/API/index.api.js";
import { apiClient } from "@/lib/api-admin.js";
import { createContext, useEffect, useState } from "react";

export const SellProductContext = createContext();

const SellProductContextProvider = (props) => {
  const [customers, setCustomers] = useState([]);
  const [allProducts, setAllProducts] = useState([]);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const res = await apiClient.get(GET_ALL_CUSTOMERS_ROUTE);

        if (res.status === 200 && res.data.status === 200) {
          setCustomers(res.data.data);
        } else {
          setCustomers([]);
        }
      } catch (error) {
        console.log(error);
      }
    };

    const fetchAllProducts = async () => {
      try {
        const res = await apiClient.get(GET_ALL_PRODUCTS_ROUTE);

        if (res.status === 200 && res.data.status === 200) {
          setAllProducts(res.data.data);
        } else {
          setAllProducts([]);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchAllProducts();
    fetchCustomers();
  }, []);

  const contextValue = {
    customers,
    allProducts,
    setAllProducts,
    setCustomers,
  };
  return (
    <SellProductContext.Provider value={contextValue}>
      {props.children}
    </SellProductContext.Provider>
  );
};

export default SellProductContextProvider;
