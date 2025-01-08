import CartItemBox from "./components/CartItemBox.jsx";
import CartItemBoxBuy from "./components/CartItemBoxBuy.jsx";

const CartHasItem = () => {
  return (
    <div>
      <div className="relative grid items-start gap-4 md:container md:grid-cols-1 md:pb-4 md:pt-6 lg:grid-cols-[min(80%,calc(1024rem/16)),1fr]">
        <CartItemBox />
        <CartItemBoxBuy />
      </div>
    </div>
  );
};

export default CartHasItem;
