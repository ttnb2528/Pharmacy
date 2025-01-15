import { GET_ALL_ADDRESSES_ROUTE, GET_USER_INFO } from "@/API/index.api.js";
import { apiClient } from "@/lib/api-client.js";
import { createContext, useEffect, useState } from "react";

export const PharmacyContext = createContext(null);

// const getDefaultCart = () => {
//   let cart = {};
//   for (let index = 0; index < 300 + 1; index++) {
//     cart[index] = 0;
//   }

//   return cart;
// };

const PharmacyContextProvider = (props) => {
  const [userData, setUserData] = useState(null);
  const [addressData, setAddressData] = useState([]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const resUser = await apiClient.get(GET_USER_INFO);
        if (resUser.status === 200) {
          setUserData(resUser.data.data);
        } else if (resUser.status === 500) {
          setUserData(null);
        }
      } catch (error) {
        console.error("Lỗi khi lấy thông tin người dùng:", error);
      }
    };

    const fetchAddressData = async () => {
      try {
        const resAddress = await apiClient.get(GET_ALL_ADDRESSES_ROUTE);
        if (resAddress.status === 200) {
          setAddressData(resAddress.data.data);
        } else if (resAddress.status === 500) {
          setAddressData(null);
        }
      } catch (error) {
        console.error("Lỗi khi lấy thông tin địa chỉ:", error);
      }
    };

    fetchUserData();
    fetchAddressData();
  }, []);

  const updateUserData = (newUserData) => {
    setUserData(newUserData);
  };

  const contextValue = {
    userData,
    updateUserData,
    addressData,
    setAddressData 
  };

  return (
    <PharmacyContext.Provider value={contextValue}>
      {props.children}
    </PharmacyContext.Provider>
  );
};

export default PharmacyContextProvider;
