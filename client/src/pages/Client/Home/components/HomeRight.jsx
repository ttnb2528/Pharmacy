import right1 from "@/assets/banner/right1.jpg";
import right2 from "@/assets/banner/right2.jpg";

const HomeRight = () => {
  return (
    <div>
      <img src={right1} alt="" className="w-full h-auto rounded mb-4" />
      <img src={right2} alt="" className="w-full h-auto rounded" />
    </div>
  );
};

export default HomeRight;
