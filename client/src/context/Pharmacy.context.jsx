import {
  GET_ALL_ADDRESSES_ROUTE,
  GET_ALL_CATEGORIES_ROUTE,
  GET_ALL_PRODUCTS_ROUTE,
  GET_COUPONS_ROUTE,
  GET_PRODUCT_BY_BEST_SELLING_ROUTE,
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
  const [productsBestSelling, setProductsBestSelling] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
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
        } else {
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
        } else {
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
        } else {
          setAllProducts(null);
        }
      } catch (error) {
        console.error("Lỗi khi lấy thông tin sản phẩm:", error);
      }
    };

    const fetchBestSellingProducts = async () => {
      try {
        const resBestSellingProducts = await apiClient.get(
          GET_PRODUCT_BY_BEST_SELLING_ROUTE
        );
        if (resBestSellingProducts.status === 200) {
          setProductsBestSelling(resBestSellingProducts.data.data);
        } else {
          setProductsBestSelling(null);
        }
      } catch (error) {
        console.error("Lỗi khi lấy thông tin sản phẩm bán chạy:", error);
      }
    };

    const fetchCategories = async () => {
      try {
        const resCategories = await apiClient.get(GET_ALL_CATEGORIES_ROUTE);
        if (resCategories.status === 200) {
          setCategories(resCategories.data.data);
        } else {
          setCategories(null);
        }
      } catch (error) {
        console.error("Lỗi khi lấy thông tin danh mục:", error);
      }
    };

    fetchUserData();
    fetchAddressData();
    fetchCouponData();
    fetchCategories();
    fetchAllProducts();
    fetchBestSellingProducts();
    setLoading(false);
  }, []);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     setLoading(true); // Set loading to true before fetching data

  //     // Fetch user, address, coupon, product, and category data
  //     const [resUser, resAddress, resCoupon, resProducts, resCategories] =
  //       await Promise.all([
  //         apiClient.get(GET_USER_INFO),
  //         apiClient.get(GET_ALL_ADDRESSES_ROUTE),
  //         apiClient.get(GET_COUPONS_ROUTE),
  //         apiClient.get(GET_ALL_PRODUCTS_ROUTE),
  //         apiClient.get(GET_ALL_CATEGORIES_ROUTE),
  //       ]);

  //     // Set data and loading state
  //     setUserData(resUser.data.data);
  //     setAddressData(resAddress.data.data);
  //     setCouponData(resCoupon.data.data);
  //     setAllProducts(resProducts.data.data);
  //     setCategories(resCategories.data.data);
  //     setLoading(false); // Set loading to false after all data is fetched
  //   };

  //   fetchData();
  // }, []);

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
        // Tìm sản phẩm có id tương ứng
        const product = allProducts.find((p) => p.id === parseInt(item));
        if (product?.batches?.[0]?.price) {
          totalPrice += carts[item] * product.batches[0].price;
        }
      }
    }

    return totalPrice;
  };

  const CalculatePriceWithSale = (carts) => {
    let totalPrice = 0;

    for (const item in carts) {
      if (carts[item] > 0) {
        const product = allProducts.find((p) => p.id === parseInt(item));
        if (product?.batches?.[0]?.price) {
          totalPrice +=
            carts[item] *
            ((product.percentDiscount / 100) * product.batches[0].price);
        }
      }
    }

    return totalPrice;
  };

  const CalculatePriceAfterSale = (carts) => {
    let totalPrice = 0;

    for (const item in carts) {
      if (carts[item] > 0) {
        const product = allProducts.find((p) => p.id === parseInt(item));
        if (product?.batches?.[0]?.price) {
          totalPrice +=
            carts[item] *
            (product.batches[0].price -
              (product.percentDiscount / 100) * product.batches[0].price);
        }
      }
    }

    return totalPrice;
  };

  const CalculateTotalPrice = () => {
    let totalPrice = 0;

    if (selectedCoupon) {
      if (selectedCoupon.discount_type === "percentage") {
        totalPrice =
          CalculatePriceAfterSale(cart) *
          (1 - selectedCoupon.discount_value / 100);
      } else {
        totalPrice =
          CalculatePriceAfterSale(cart) - selectedCoupon.discount_value;
      }
    } else {
      totalPrice = CalculatePriceAfterSale(cart);
    }

    return totalPrice;
  };

  const contextValue = {
    loading,
    userData,
    updateUserData,
    addressData,
    setAddressData,
    couponData,
    allProducts,
    productsBestSelling,
    cart,
    setCart,
    selectedCoupon,
    setSelectedCoupon,
    CalculateTotalItems,
    CalculateTotalPriceTemp,
    CalculatePriceWithSale,
    CalculateTotalPrice,
    categories,
  };

  return (
    <PharmacyContext.Provider value={contextValue}>
      {props.children}
    </PharmacyContext.Provider>
  );
};

export default PharmacyContextProvider;
