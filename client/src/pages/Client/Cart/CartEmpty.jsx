import cartEmpty from "@/assets/empty-cart.png";
import { Link } from "react-router-dom";

const CartEmpty = () => {
  return (
    <div>
      <div className="flex justify-center items-center flex-col my-10">
        <img src={cartEmpty} alt="cart Empty" />
        <p className="my-5">
          Tiếc quá không tìm thấy sản phẩm nào trong giỏ hàng của bạn.
        </p>
        <button className="w-[100%] max-w-[296px] text-white bg-[#feaa48] rounded-xl min-h-[54px] p-1 font-medium text-[18px]">
          <Link to="/">Tiếp tục mua hàng</Link>
        </button>
      </div>
    </div>
  );
};

export default CartEmpty;
