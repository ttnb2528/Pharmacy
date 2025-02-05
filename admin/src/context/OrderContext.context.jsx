import { GET_ALL_ORDERS_ROUTE } from "@/API/index.api.js";
import { apiClient } from "@/lib/api-admin.js";
import { createContext, useEffect, useState } from "react";

export const OrderContext = createContext();

const OrderContextProvider = (props) => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const getOrders = async () => {
      const res = await apiClient.get(GET_ALL_ORDERS_ROUTE);

      if (res.status === 200 && res.data.status === 200) {
        setOrders(res.data.data);
      }
    };

    getOrders();
  }, []);

  const contextValue = {
    orders,
    setOrders,
  };
  return (
    <OrderContext.Provider value={contextValue}>
      {props.children}
    </OrderContext.Provider>
  );
};

export default OrderContextProvider;
