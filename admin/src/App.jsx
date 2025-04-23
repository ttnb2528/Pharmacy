import { createBrowserRouter } from "react-router-dom";
import DashBoard from "./pages/DashBoard.jsx";
import { RouterProvider } from "react-router";
import NotFound from "./pages/NotFound.jsx";
import Products from "./pages/Product/Products.jsx";
import Overview from "./pages/Overview.jsx";
import MedicineContextProvider from "./context/ProductContext.context.jsx";
import AdminCustomer from "./pages/Customer/AdminCustomer.jsx";
import AdminBrand from "./pages/Brand/AdminBrand.jsx";
import AdminCategory from "./pages/Category/AdminCategory.jsx";
import CategoryContextProvider from "./context/CategoryContext.context.jsx";
import ManufactureContextProvider from "./context/ManufactureContext.context.jsx";
import AdminManufacture from "./pages/Manufacture/AdminManufacture.jsx";
import SupplierContextProvider from "./context/SupllierContext.controller.jsx";
import AdminSupplier from "./pages/Supllier/AdminSupplier.jsx";
import AdminCoupon from "./pages/Coupon/AdminCoupon.jsx";
import CouponContextProvider from "./context/CouponContext.context.jsx";
import AdminStaff from "./pages/Staff/AdminStaff.jsx";
import StaffContextProvider from "./context/StaffContext.context.jsx";
import AdminShiftWork from "./pages/ShiftWork/AdminShiftWork.jsx";
import ShiftWorkContextProvider from "./context/ShiftWorkContext.context.jsx";
import AdminOrders from "./pages/Order/AdminOrders.jsx";
import Login from "./pages/Login.jsx";
import OrderContextProvider from "./context/OrderContext.context.jsx";
import ProfilePage from "./pages/Profile/Profile.jsx";
import ProfileContextProvider from "./context/ProfileContext.context.jsx";
import UpdatePassword from "./pages/Profile/UpdatePassword.jsx";
import SellMedicinePage from "./pages/SellProduct/AdminSellProduct.jsx";
import SellProductContextProvider from "./context/SellProductContext.context.jsx";
import BillContextProvider from "./context/BillContext.context.jsx";
import AdminBill from "./pages/Bill/AdminBill.jsx";
import Statistics from "./pages/Statistics/Statistics.jsx";
import BatchesContextProvider from "./context/BatchesContext.context.jsx";

import PrivateRoute2 from "./layout/PrivateRoute2.jsx";
import { useAppStore } from "./store/index.js";
import { useEffect, useState } from "react";
import { apiClient } from "./lib/api-admin.js";
import { GET_CURRENT_STAFF } from "./API/index.api.js";
import Loading from "./pages/component/Loading.jsx";
import SliderBanner from "./pages/SlideBanner/SliderBanner.jsx";
import SliderBannerContextProvider from "./context/SliderBannerContext.jsx";

const App = () => {
  const { userInfo, setUserInfo } = useAppStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUserData = async () => {
      try {
        const res = await apiClient.get(GET_CURRENT_STAFF);
        // console.log(res);
        
        if (res.status === 200 && res.data.status === 200) {
          setUserInfo(res.data.data);
        } else {
          setUserInfo(undefined);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    if (!userInfo) {
      getUserData();
    } else {
      setLoading(false);
    }
  }, [userInfo, setUserInfo]);

  if (loading) {
    return <Loading />;
  }

  const router = createBrowserRouter([
    {
      path: "/",
      element: <DashBoard />,
      children: [
        {
          index: true,
          element: (
            <PrivateRoute2>
              <Overview />
            </PrivateRoute2>
          ),
        },
        {
          path: "slider",
          element: (
            <PrivateRoute2>
              <SliderBannerContextProvider>
                <SliderBanner />
              </SliderBannerContextProvider>
            </PrivateRoute2>
          ),
        },
        {
          path: "products",
          element: (
            <PrivateRoute2>
              <MedicineContextProvider>
                <Products />
              </MedicineContextProvider>
            </PrivateRoute2>
          ),
        },
        {
          path: "sell-medicine",
          element: (
            <PrivateRoute2>
              <SellProductContextProvider>
                <SellMedicinePage />
              </SellProductContextProvider>
            </PrivateRoute2>
          ),
        },
        {
          path: "brands",
          element: (
            <PrivateRoute2>
              <AdminBrand />
            </PrivateRoute2>
          ),
        },
        {
          path: "categories",
          element: (
            <PrivateRoute2>
              <CategoryContextProvider>
                <AdminCategory />
              </CategoryContextProvider>
            </PrivateRoute2>
          ),
        },
        {
          path: "coupons",
          element: (
            <PrivateRoute2>
              <CouponContextProvider>
                <AdminCoupon />
              </CouponContextProvider>
            </PrivateRoute2>
          ),
        },
        {
          path: "customers",
          element: (
            <PrivateRoute2>
              <AdminCustomer />
            </PrivateRoute2>
          ),
        },
        {
          path: "employees",
          element: (
            <PrivateRoute2>
              <StaffContextProvider>
                <AdminStaff />
              </StaffContextProvider>
            </PrivateRoute2>
          ),
        },
        {
          path: "manufacturers",
          element: (
            <PrivateRoute2>
              <ManufactureContextProvider>
                <AdminManufacture />
              </ManufactureContextProvider>
            </PrivateRoute2>
          ),
        },
        {
          path: "orders",
          element: (
            <PrivateRoute2>
              <OrderContextProvider>
                <AdminOrders />
              </OrderContextProvider>
            </PrivateRoute2>
          ),
        },
        {
          path: "bills",
          element: (
            <PrivateRoute2>
              <BillContextProvider>
                <AdminBill />
              </BillContextProvider>
            </PrivateRoute2>
          ),
        },
        {
          path: "shift-works",
          element: (
            <PrivateRoute2>
              <ShiftWorkContextProvider>
                <AdminShiftWork />
              </ShiftWorkContextProvider>
            </PrivateRoute2>
          ),
        },
        {
          path: "suppliers",
          element: (
            <PrivateRoute2>
              <SupplierContextProvider>
                <AdminSupplier />
              </SupplierContextProvider>
            </PrivateRoute2>
          ),
        },
        {
          path: "reports",
          element: (
            <PrivateRoute2>
              <BatchesContextProvider>
                <Statistics />
              </BatchesContextProvider>
            </PrivateRoute2>
          ),
        },
        {
          path: "profile",
          element: (
            <PrivateRoute2>
              <ProfileContextProvider>
                <ProfilePage />
              </ProfileContextProvider>
            </PrivateRoute2>
          ),
        },
        {
          path: "change-password",
          element: (
            <PrivateRoute2>
              <ProfileContextProvider>
                <UpdatePassword />
              </ProfileContextProvider>
            </PrivateRoute2>
          ),
        },
      ],
    },
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "*",
      element: <NotFound />,
    },
  ]);

  return <RouterProvider router={router} />;
};

export default App;
