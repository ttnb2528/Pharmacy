// import { BrowserRouter, Routes, Route } from "react-router-dom";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "@/pages/Client/Home/Home.jsx";
import { Layout } from "./layout/Layout.jsx";
import Product from "./pages/Client/Product/Product.jsx";
import ProductDisplay from "./pages/Client/Product/ProductDisplay.jsx";
import Cart from "./pages/Client/Cart/Cart.jsx";
import Checkout from "./pages/Client/Cart/Checkout.jsx";
import Account from "./pages/Client/Account/Account.jsx";
import PersonalInfo from "./pages/Client/Account/components/PersonalInfo.jsx";
import OrderHistory from "./pages/Client/Account/components/OrderHistory.jsx";
import Coupons from "./pages/Client/Account/components/Coupons.jsx";
import Addresses from "./pages/Client/Account/components/Addresses.jsx";
import PointsHistory from "./pages/Client/Account/components/PointsHistory.jsx";
import PointsPolicy from "./pages/Client/Account/components/PointsPolicy.jsx";
import UpdatePassword from "./pages/Client/Account/components/UpdatePassword.jsx";
import NotFound from "./pages/component/NotFound.jsx";

const App = () => {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        {
          path: "/",
          element: <Home />,
        },
        {
          path: "/duoc-pham",
          element: <Product title="Dược Phẩm" />,
        },
        {
          path: "/cham-soc-suc-khoe",
          element: <Product title="Chăm Sóc Sức Khỏe" />,
        },
        {
          path: "/cham-soc-ca-nhan",
          element: <Product title="Chăm Sóc Cá Nhân" />,
        },
        {
          path: "/me-va-be",
          element: <Product title="Mẹ Và Bé" />,
        },
        {
          path: "/san-pham-tien-loi",
          element: <Product title="Sản Phẩm Tiện Lợi" />,
        },
        {
          path: "/thuc-pham-chuc-nang",
          element: <Product title="Thực Phẩm Chức Năng" />,
        },
        {
          path: "/cham-soc-nhan-sac",
          element: <Product title="Chăm Sóc Nhan Sắc" />,
        },
        {
          path: "/thiet-bi-y-te",
          element: <Product title="Thiết Bị Y Tế" />,
        },
        {
          path: "/product/:id",
          element: <ProductDisplay />,
        },
        {
          path: "/cart",
          element: <Cart />,
        },
        {
          path: "/checkout",
          element: <Checkout />,
        },
        {
          path: "/account",
          element: <Account />,
          children: [
            { path: "info", element: <PersonalInfo /> },
            { path: "history", element: <OrderHistory /> },
            { path: "coupons", element: <Coupons /> },
            { path: "addresses", element: <Addresses /> },
            { path: "points", element: <PointsHistory /> },
            { path: "policy", element: <PointsPolicy /> },
            { path: "info/update-password", element: <UpdatePassword /> },
          ],
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
