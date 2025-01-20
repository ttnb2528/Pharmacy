import { ADD_TO_CART_ROUTE } from "@/API/index.api.js";
import { Button } from "@/components/ui/button.jsx";
import { PharmacyContext } from "@/context/Pharmacy.context.jsx";
import { apiClient } from "@/lib/api-client.js";
import { CalculateProductWithSale } from "@/utils/Calculate.js";
import { convertVND } from "@/utils/ConvertVND.js";
import { useContext, useState } from "react";
import { Link } from "react-router-dom";

const ItemDeal = ({ product, setIsLoading }) => {
  const [startPosition, setStartPosition] = useState({ x: 0, y: 0 });

  const { setCart } = useContext(PharmacyContext);

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

  const AddToCart = async (productId) => {
    try {
      setIsLoading(true);
      const res = await apiClient.post(ADD_TO_CART_ROUTE, {
        productId: productId,
        quantity: 1,
      });

      if (res.status === 200 && res.data.status === 200) {
        setCart((prev) => {
          return {
            ...prev,
            [productId]: prev[productId] + 1,
          };
        });
      }

      console.log(res);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="relative p-2" onMouseDown={handleMouseDown}>
      <div className="product-card  hover:border hover:border-red-300 hover:rounded-lg">
        <div className="h-full overflow-hidden rounded-lg border bg-white shadow-sm">
          <div className="product-card-image">
            <div className="relative">
              <Link to={`/product/${product.id}`} onClick={handleClick}>
                <img
                  className="max-h-full max-w-full object-contain cursor-pointer"
                  src={product.images[0]}
                  alt="product"
                  width="500"
                  height="500"
                />
              </Link>
              <span className="absolute top-2 left-2 bg-red-400 py-1 px-3 text-xs font-bold text-white rounded-xl">
                {product.percentDiscount}%
              </span>
              <div className="absolute bottom-0 left-0 flex h-6 w-full"></div>
            </div>
          </div>
          <div className="p-2 pb-1 font-medium">
            <div>
              <h3 className="line-clamp-2 h-10 text-sm font-semibold">
                {product.name}
              </h3>
            </div>
            {product.batches.length > 0 && product.quantityStock > 0 ? (
              <div className="my-1 items-center whitespace-nowrap">
                <del className="block h-5 text-sm font-semibold text-neutral-600">
                  {convertVND(product.batches[0].price)}
                </del>
                <span className="mt-1 block h-6 text-base font-bold text-green-600">
                  {convertVND(
                    CalculateProductWithSale(
                      product.batches[0].price,
                      product.percentDiscount
                    )
                  )}
                </span>
              </div>
            ) : (
              <div className="my-1 items-center whitespace-nowrap">
                <div className="h-5"></div>
                <span className="mt-1 block h-6 text-base font-bold text-red-600">
                  Tạm hết hàng
                </span>
              </div>
            )}
          </div>
          <div className="flex justify-center items-center my-3">
            <Button
              className="w-5/6 bg-[#26773d] hover:bg-[#0e562e]"
              onClick={() => AddToCart(product.id)}
            >
              Thêm giỏ hàng
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemDeal;
