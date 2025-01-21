import { useContext } from "react";
import CartEmpty from "./CartEmpty.jsx";
import CartHasItem from "./CartHasItem.jsx";
import { PharmacyContext } from "@/context/Pharmacy.context.jsx";

const Cart = () => {
  const { cart } = useContext(PharmacyContext);
  const hasValue = Object.values(cart).some((value) => value > 0);
  return hasValue ? <CartHasItem /> : <CartEmpty />;
};

export default Cart;
