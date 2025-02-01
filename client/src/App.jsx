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
import { useContext, useMemo } from "react";
import { PharmacyContext } from "./context/Pharmacy.context.jsx";
import slugify from "slugify";
import Loading from "./pages/component/Loading.jsx";
import OrderDetail from "./pages/Client/Account/components/OrderDetail.jsx";
import PrivateRoute from "./layout/PrivateRoute.jsx";

const App = () => {
  const { categories, loading } = useContext(PharmacyContext);

  const routes = useMemo(() => {
    // Public routes - không cần đăng nhập
    const publicRoutes = [
      {
        path: "/",
        element: <Layout />,
        children: [
          {
            path: "/",
            element: <Home />,
          },
          {
            path: "/search",
            element: <SearchResult />,
          },
          {
            path: "/cart",
            element: <Cart />,
          },
          // Thêm các category routes vào đây
          ...(categories
            ?.map((category) => [
              {
                path: `/${slugify(category?.name, { lower: true })}`,
                element: (
                  <Product title={category?.name} categoryId={category?._id} />
                ),
              },
              {
                path: `/${slugify(category?.name, {
                  lower: true,
                })}/:productName`,
                element: <ProductDisplay />,
              },
            ])
            .flat() || []),
        ],
      },
    ];

    // Protected routes - cần đăng nhập
    const protectedRoutes = [
      {
        path: "/checkout",
        element: (
          <PrivateRoute>
            <Checkout />
          </PrivateRoute>
        ),
      },
      {
        path: "/account",
        element: (
          <PrivateRoute>
            <Account />
          </PrivateRoute>
        ),
        children: [
          {
            path: "info",
            element: <PersonalInfo />,
          },
          {
            path: "history",
            element: <OrderHistory />,
          },
          {
            path: "history/:orderId",
            element: <OrderDetail />,
          },
          {
            path: "coupons",
            element: <Coupons />,
          },
          {
            path: "addresses",
            element: <Addresses />,
          },
          {
            path: "points",
            element: <PointsHistory />,
          },
          {
            path: "policy",
            element: <PointsPolicy />,
          },
          {
            path: "info/update-password",
            element: <UpdatePassword />,
          },
        ],
      },
    ];

    // Combine all routes
    return [
      {
        path: "/",
        element: <Layout />,
        children: [...publicRoutes[0].children, ...protectedRoutes],
      },
      {
        path: "*",
        element: <NotFound />,
      },
    ];
  }, [categories]);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  return <RouterProvider router={createBrowserRouter(routes)} />;
};

export default App;
