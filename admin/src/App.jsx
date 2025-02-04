import { createBrowserRouter } from "react-router-dom";
import DashBoard from "./pages/DashBoard.jsx";
import { RouterProvider } from "react-router";
import NotFound from "./pages/NotFound.jsx";
import Products from "./pages/Products.jsx";
import Overview from "./pages/Overview.jsx";
import MedicineContextProvider from "./context/ProductContext.context.jsx";
import AdminCustomer from "./pages/Customer/AdminCustomer.jsx";
import AdminBrand from "./pages/Brand/AdminBrand.jsx";

const App = () => {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <DashBoard />,
      children: [
        {
          index: true,
          element: <Overview />,
        },
        {
          path: "products",
          element: (
            <MedicineContextProvider>
              <Products />
            </MedicineContextProvider>
          ),
        },
        {
          path: "brands",
          element: <AdminBrand />,
        },
        {
          path: "categories",
          element: <div>Categories</div>,
        },
        {
          path: "coupons",
          element: <div>Coupons</div>,
        },
        {
          path: "customers",
          element: <AdminCustomer />,
        },
        {
          path: "employees",
          element: <div>Employees</div>,
        },
        {
          path: "manufacturers",
          element: <div>Manufacturers</div>,
        },
        {
          path: "orders",
          element: <div>Orders</div>,
        },
        {
          path: "schedules",
          element: <div>Schedules</div>,
        },
        {
          path: "suppliers",
          element: <div>Suppliers</div>,
        },
        {
          path: "reports",
          element: <div>Reports</div>,
        },
      ],
    },
    {
      path: "*",
      element: <NotFound />,
    },
  ]);

  return <RouterProvider router={router} />;
};

export default App;
