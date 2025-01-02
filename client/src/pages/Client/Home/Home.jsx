import HomeBanner from "./components/HomeBanner.jsx";
import HomeBestSelling from "./components/HomeBestSelling.jsx";
import HomeDeal from "./components/HomeDeal.jsx";
import HomeProductForGroup from "./components/HomeProductForGroup.jsx";
import HomeSuggest from "./components/HomeSuggest.jsx";

const Home = () => {
  return (
    <div className="mt-4">
      <HomeBanner />
      <HomeDeal />
      <HomeBestSelling />
      <HomeProductForGroup />
      <HomeSuggest />
    </div>
  );
};

export default Home;
