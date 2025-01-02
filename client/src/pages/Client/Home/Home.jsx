import HomeBanner from "./components/HomeBanner.jsx";
import HomeBestSelling from "./components/HomeBestSelling.jsx";
import HomeDeal from "./components/HomeDeal.jsx";
import HomeProductForGroup from "./components/HomeProductForGroup.jsx";

const Home = () => {
  return (
    <div className="mt-4">
      <HomeBanner />
      <HomeDeal />
      <HomeBestSelling />
      <HomeProductForGroup />
    </div>
  );
};

export default Home;
