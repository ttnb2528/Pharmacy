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
import SearchResult from "./pages/Client/Product/SearchResult.jsx";
import { useContext } from "react";
import { PharmacyContext } from "./context/Pharmacy.context.jsx";
import slugify from "slugify";
import Loading from "./pages/component/Loading.jsx";
import OrderDetail from "./pages/Client/Account/components/OrderDetail.jsx";

const App = () => {
  const { categories, loading } = useContext(PharmacyContext);

  if (loading) {
    return <Loading />;
  }

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        {
          path: "/",
          element: <Home />,
        },
        ...categories.map((category) => ({
          path: `/${slugify(category?.name, { lower: false })}`,
          element: (
            <Product title={category?.name} categoryId={category?._id} />
          ),
          // children: [
          //   {
          //     path: ":productName",
          //     element: <ProductDisplay />,
          //   },
          // ],
        })),
        ...categories.map((category) => ({
          path: `/${slugify(category?.name, { lower: false })}/:productName`,
          element: <ProductDisplay />,
        })),
        {
          path: "/search",
          element: <SearchResult />,
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
            { path: "history", element: <OrderHistory />, },
            { path: "history/:orderId", element: <OrderDetail /> },
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
