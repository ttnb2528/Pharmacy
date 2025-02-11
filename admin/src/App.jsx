import { createBrowserRouter } from "react-router-dom";
import DashBoard from "./pages/DashBoard.jsx";
import { RouterProvider } from "react-router";
import NotFound from "./pages/NotFound.jsx";
import Products from "./pages/Products.jsx";
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
import PrivateRoute from "./layout/PrivateRoute.jsx";
import ProfilePage from "./pages/Profile/Profile.jsx";
import ProfileContextProvider from "./context/ProfileContext.context.jsx";
import UpdatePassword from "./pages/Profile/UpdatePassword.jsx";
import SellMedicinePage from "./pages/SellProduct/AdminSellProduct.jsx";
import SellProductContextProvider from "./context/SellProductContext.context.jsx";

const App = () => {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <DashBoard />,
      children: [
        {
          index: true,
          element: (
            <PrivateRoute>
              <Overview />
            </PrivateRoute>
          ),
        },
        {
          path: "products",
          element: (
            <PrivateRoute>
              <MedicineContextProvider>
                <Products />
              </MedicineContextProvider>
            </PrivateRoute>
          ),
        },
        {
          path: "sell-medicine",
          element: (
            <PrivateRoute>
              <SellProductContextProvider>
                <SellMedicinePage />
              </SellProductContextProvider>
            </PrivateRoute>
          ),
        },
        {
          path: "brands",
          element: (
            <PrivateRoute>
              <AdminBrand />,
            </PrivateRoute>
          ),
        },
        {
          path: "categories",
          element: (
            <PrivateRoute>
              <CategoryContextProvider>
                <AdminCategory />,
              </CategoryContextProvider>
            </PrivateRoute>
          ),
        },
        {
          path: "coupons",
          element: (
            <PrivateRoute>
              <CouponContextProvider>
                <AdminCoupon />
              </CouponContextProvider>
            </PrivateRoute>
          ),
        },
        {
          path: "customers",
          element: (
            <PrivateRoute>
              <AdminCustomer />,
            </PrivateRoute>
          ),
        },
        {
          path: "employees",
          element: (
            <PrivateRoute isAdmin>
              <StaffContextProvider>
                <AdminStaff />
              </StaffContextProvider>
            </PrivateRoute>
          ),
        },
        {
          path: "manufacturers",
          element: (
            <PrivateRoute>
              <ManufactureContextProvider>
                <AdminManufacture />
              </ManufactureContextProvider>
            </PrivateRoute>
          ),
        },
        {
          path: "orders",
          element: (
            <PrivateRoute>
              <OrderContextProvider>
                <AdminOrders />,
              </OrderContextProvider>
            </PrivateRoute>
          ),
        },
        {
          path: "shift-works",
          element: (
            <PrivateRoute>
              <ShiftWorkContextProvider>
                <AdminShiftWork />
              </ShiftWorkContextProvider>
            </PrivateRoute>
          ),
        },
        {
          path: "suppliers",
          element: (
            <PrivateRoute>
              <SupplierContextProvider>
                <AdminSupplier />
              </SupplierContextProvider>
            </PrivateRoute>
          ),
        },
        {
          path: "reports",
          element: <div>Reports</div>,
        },
        {
          path: "profile",
          element: (
            <ProfileContextProvider>
              <ProfilePage />,
            </ProfileContextProvider>
          ),
        },
        {
          path: "change-password",
          element: (
            <ProfileContextProvider>
              <UpdatePassword />,
            </ProfileContextProvider>
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
