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
import { useContext, useEffect, useMemo, useState } from "react";
import { PharmacyContext } from "./context/Pharmacy.context.jsx";
import slugify from "slugify";
import Loading from "./pages/component/Loading.jsx";
import OrderDetail from "./pages/Client/Account/components/OrderDetail.jsx";
// import PrivateRoute from "./layout/PrivateRoute.jsx";
import PrivateRoute2 from "./layout/PrivateRoute2.jsx";
import HomeContextProvider from "./context/HomeContext.context.jsx";
import { apiClient } from "./lib/api-client.js";
import { GET_USER_INFO } from "./API/index.api.js";
import { useAppStore } from "./store/index.js";
import PaymentReturn from "./pages/Client/Payment/PaymentReturn.jsx";
import UpdateEmail from "./pages/Client/Account/components/UpdateEmail.jsx";

const App = () => {
  const { userInfo, setUserInfo } = useAppStore();
  const { categories, loading } = useContext(PharmacyContext);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const getUserData = async () => {
      setIsLoading(true);
      try {
        const res = await apiClient.get(GET_USER_INFO);

        if (res.status === 200 && res.data.status === 200) {
          setUserInfo(res.data.data);
        } else {
          setUserInfo(undefined);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };

    if (!userInfo) {
      getUserData();
    } else {
      setIsLoading(false);
    }
  }, [userInfo, setUserInfo, setIsLoading]);

  const routes = useMemo(() => {
    // Public routes - không cần đăng nhập
    const publicRoutes = [
      {
        path: "/",
        element: (
          // <HomeContextProvider>
          <Layout />
          // </HomeContextProvider>
        ),
        children: [
          {
            path: "/",
            element: (
              // <HomeContextProvider>
              <Home />
              // </HomeContextProvider>
            ),
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
        path: "/payment-return",
        element: <PaymentReturn />,
      },
      {
        path: "/checkout",
        element: (
          <PrivateRoute2>
            <Checkout />
          </PrivateRoute2>
        ),
      },
      {
        path: "/account",
        element: (
          <PrivateRoute2>
            <Account />
          </PrivateRoute2>
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
          {
            path: "info/update-email",
            element: <UpdateEmail />,
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

  if (loading || isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  return (
    <HomeContextProvider>
      <RouterProvider router={createBrowserRouter(routes)} />
    </HomeContextProvider>
  );
};

export default App;
