import test_product_image1 from "@/assets/test_product_image1.jpg";
import { Button } from "@/components/ui/button.jsx";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

const Item = () => {
  const [startPosition, setStartPosition] = useState({ x: 0, y: 0 });

  const handleMouseDown = (e) => {
    setStartPosition({ x: e.clientX, y: e.clientY });
  };

  const handleClick = (e) => {
    const endPosition = { x: e.clientX, y: e.clientY };
    const distance = Math.sqrt(
      Math.pow(endPosition.x - startPosition.x, 2) +
        Math.pow(endPosition.y - startPosition.y, 2)
    );
    if (distance > 5) {
      e.preventDefault();
    }
  };

  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);
  return (
    <div className=" p-2" onMouseDown={handleMouseDown}>
      <div className="product-card  hover:border hover:border-red-300 hover:rounded-lg">
        <div className="h-full overflow-hidden rounded-lg border bg-white shadow-sm">
          <div className="product-card-image">
            <div>
              <Link to="/product/123" onClick={handleClick}>
                <img
                  className="max-h-full max-w-full object-contain cursor-pointer"
                  src={test_product_image1}
                  alt="product"
                  width="500"
                  height="500"
                />
              </Link>

              <div className="absolute bottom-0 left-0 flex h-6 w-full"></div>
            </div>
          </div>
          <div className="p-2 pb-1 font-medium">
            <div>
              <h3 className="line-clamp-2 h-10 text-sm font-semibold">
                Sữa bột Ensure Gold StrengthPro Abbott hương vani tăng cường sức
                khỏe...
              </h3>
            </div>
            <div className="my-1 items-center whitespace-nowrap">
              <span className="mt-1 block h-6 text-base font-bold text-green-600">
                20000d
              </span>
            </div>
          </div>
          <div className="flex justify-center items-center my-3">
            <Button
              className="w-5/6 bg-[#26773d] hover:bg-[#0e562e]"
              onClick={() => {
                alert("add to cart");
              }}
            >
              Thêm giỏ hàng
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Item;
