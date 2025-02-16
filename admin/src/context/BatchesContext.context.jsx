import {
  GET_ALL_BATCHES_ROUTE,
  GET_ALL_BILLS_ROUTE,
  GET_ALL_ORDERS_ROUTE,
} from "@/API/index.api.js";
import { apiClient } from "@/lib/api-admin.js";
import { createContext, useEffect, useState } from "react";

export const BatchesContext = createContext();

const BatchesContextProvider = (props) => {
  const [batches, setBatches] = useState([]);
  const [bills, setBills] = useState([]);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const getBatches = async () => {
      const res = await apiClient.get(GET_ALL_BATCHES_ROUTE);

      if (res.status === 200 && res.data.status === 200) {
        setBatches(res.data.data);
      }
    };

    const getBills = async () => {
      const res = await apiClient.get(GET_ALL_BILLS_ROUTE);

      if (res.status === 200 && res.data.status === 200) {
        setBills(res.data.data);
      }
    };

    const getOrders = async () => {
      const res = await apiClient.get(GET_ALL_ORDERS_ROUTE);

      if (res.status === 200 && res.data.status === 200) {
        setOrders(res.data.data);
      }
    };

    getBatches();
    getBills();
    getOrders();
  }, []);

  const contextValue = {
    batches,
    bills,
    orders,
    setBatches,
    setBills,
    setOrders,
  };
  return (
    <BatchesContext.Provider value={contextValue}>
      {props.children}
    </BatchesContext.Provider>
  );
};

export default BatchesContextProvider;
