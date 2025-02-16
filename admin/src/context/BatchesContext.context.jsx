import { GET_ALL_BATCHES_ROUTE } from "@/API/index.api.js";
import { apiClient } from "@/lib/api-admin.js";
import { createContext, useEffect, useState } from "react";

export const BatchesContext = createContext();

const BatchesContextProvider = (props) => {
  const [batches, setBatches] = useState([]);

  useEffect(() => {
    const getBatches = async () => {
      const res = await apiClient.get(GET_ALL_BATCHES_ROUTE);

      if (res.status === 200 && res.data.status === 200) {
        setBatches(res.data.data);
      }
    };

    getBatches();
  }, []);

  const contextValue = {
    batches,
    setBatches,
  };
  return (
    <BatchesContext.Provider value={contextValue}>
      {props.children}
    </BatchesContext.Provider>
  );
};

export default BatchesContextProvider;
