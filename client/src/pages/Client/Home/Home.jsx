import { useContext } from "react";
import HomeBanner from "./components/HomeBanner.jsx";
import HomeBestSelling from "./components/HomeBestSelling.jsx";
import HomeDeal from "./components/HomeDeal.jsx";
import HomeProductForGroup from "./components/HomeProductForGroup.jsx";
import HomeSuggest from "./components/HomeSuggest.jsx";
import Login from "./components/Login.jsx";
import { HomeContext } from "@/context/HomeContext.context.jsx";

const Home = () => {
  const { showLogin, setShowLogin } = useContext(HomeContext);

  return (
    <>
      {showLogin && <Login close={() => setShowLogin(false)} />}
      <div className="mt-4">
        <HomeBanner />
        <HomeDeal />
        <HomeBestSelling />
        <HomeProductForGroup />
        <HomeSuggest />
      </div>
    </>
  );
};

export default Home;
