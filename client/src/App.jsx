// import { BrowserRouter, Routes, Route } from "react-router-dom";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "@/pages/Client/Home/Home.jsx";
import { Layout } from "./layout/Layout.jsx";
import Product from "./pages/Client/Product/Product.jsx";
import ProductDisplay from "./pages/Client/Product/ProductDisplay.jsx";
import Cart from "./pages/Client/Cart/Cart.jsx";

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
      ],
    },
  ]);

  return <RouterProvider router={router} />;
};

export default App;
