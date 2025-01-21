export const CalculateProductWithSale = (price, sale) => {
  return (price * (100 - sale)) / 100;
};

export const CalculateTotalPrice = (price, sale, quantity) => {
  return CalculateProductWithSale(price, sale) * quantity;
};

export const handleRenderPriceWithCoupon = (coupon) => {
  if (coupon?.discount_type === "percentage") {
    return `- ${coupon?.discount_value}%`;
  } else {
    return coupon?.discount_value;
  }
};
