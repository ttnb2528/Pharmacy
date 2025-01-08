import CartEmpty from "./CartEmpty.jsx";
import CartHasItem from "./CartHasItem.jsx";

const Cart = () => {
  const cartItems = [1];

  return cartItems.length > 0 ? <CartHasItem /> : <CartEmpty />;
};

export default Cart;
