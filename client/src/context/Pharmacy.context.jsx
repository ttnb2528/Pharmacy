import {
  GET_ALL_ADDRESSES_ROUTE,
  GET_ALL_PRODUCTS_ROUTE,
  GET_COUPONS_ROUTE,
  GET_USER_INFO,
} from "@/API/index.api.js";
import { apiClient } from "@/lib/api-client.js";
import { createContext, useEffect, useState } from "react";

export const PharmacyContext = createContext(null);

const getDefaultCart = () => {
  let cart = {};
  for (let index = 1; index <= 300; index++) {
    cart[index] = 0;
  }

  return cart;
};

const PharmacyContextProvider = (props) => {
  const [userData, setUserData] = useState(null);
  const [addressData, setAddressData] = useState([]);
  const [couponData, setCouponData] = useState([]);
  const [cart, setCart] = useState(getDefaultCart());
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const [allProducts, setAllProducts] = useState([]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const resUser = await apiClient.get(GET_USER_INFO);
        if (resUser.status === 200) {
          setUserData(resUser.data.data);
          setCart(resUser.data.data?.accountId?.cartData);
        } else {
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

    const fetchCouponData = async () => {
      try {
        const resCoupon = await apiClient.get(GET_COUPONS_ROUTE);
        if (resCoupon.status === 200) {
          setCouponData(resCoupon.data.data);
        } else if (resCoupon.status === 500) {
          setCouponData(null);
        }
      } catch (error) {
        console.error("Lỗi khi lấy thông tin mã giảm giá:", error);
      }
    };

    const fetchAllProducts = async () => {
      try {
        const resProducts = await apiClient.get(GET_ALL_PRODUCTS_ROUTE);
        if (resProducts.status === 200) {
          setAllProducts(resProducts.data.data);
        } else if (resProducts.status === 500) {
          setAllProducts(null);
        }
      } catch (error) {
        console.error("Lỗi khi lấy thông tin sản phẩm:", error);
      }
    };

    fetchUserData();
    fetchAddressData();
    fetchCouponData();
    fetchAllProducts();
  }, []);

  const updateUserData = (newUserData) => {
    setUserData(newUserData);
  };

  const CalculateTotalItems = (carts) => {
    let totalItems = 0;

    for (const item in carts) {
      if (carts[item] > 0) {
        totalItems += carts[item];
      }
    }

    return totalItems;
  };

  const CalculateTotalPriceTemp = (carts) => {
    let totalPrice = 0;

    for (const item in carts) {
      if (carts[item] > 0) {
        if (allProducts[item - 1]?.isDiscount) {
          totalPrice +=
            carts[item] *
            (allProducts[item - 1]?.batches[0]?.price *
              (1 - allProducts[item - 1]?.percentDiscount / 100));
        } else {
          totalPrice += carts[item] * allProducts[item - 1]?.batches[0]?.price;
        }
      }
    }

    return totalPrice;
  };

  const CalculatePriceWithSale = (carts) => {
    let totalPrice = 0;

    for (const item in carts) {
      if (carts[item] > 0) {
        totalPrice +=
          carts[item] *
          ((allProducts[item - 1]?.percentDiscount / 100) *
            allProducts[item - 1]?.batches[0]?.price);
      }
    }

    return totalPrice;
  };

  const CalculateTotalPrice = () => {
    let totalPrice = 0;

    if (selectedCoupon) {
      if (selectedCoupon.discount_type === "percentage") {
        totalPrice =
          CalculateTotalPriceTemp(cart) *
          (1 - selectedCoupon.discount_value / 100);
      } else {
        totalPrice =
          CalculateTotalPriceTemp(cart) - selectedCoupon.discount_value;
      }
    } else {
      totalPrice = CalculateTotalPriceTemp(cart);
    }

    return totalPrice;
  };

  const contextValue = {
    userData,
    updateUserData,
    addressData,
    setAddressData,
    couponData,
    allProducts,
    cart,
    setCart,
    selectedCoupon,
    setSelectedCoupon,
    CalculateTotalItems,
    CalculateTotalPriceTemp,
    CalculatePriceWithSale,
    CalculateTotalPrice,
  };

  return (
    <PharmacyContext.Provider value={contextValue}>
      {props.children}
    </PharmacyContext.Provider>
  );
};

export default PharmacyContextProvider;
