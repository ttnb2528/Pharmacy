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

export const CalculatePointEarned = (rank, price, sale) => {
  const priceAfterSale = CalculateProductWithSale(price, sale);
  switch (rank) {
    case "Bạc":
      return Math.floor(priceAfterSale * 0.01); // 1% giá sau giảm
    case "Vàng":
      return Math.floor(priceAfterSale * 0.015); // 1.5% giá sau giảm
    case "Kim cương":
      return Math.floor(priceAfterSale * 0.02); // 2% giá sau giảm
    default:
      return 0;
  }
};

export const CalculateRemainingAccumulated = (rank, totalSpending) => {
  switch (rank) {
    case "Bạc":
      if (totalSpending > 4000000) return 0;
      return 4000000 - totalSpending;
    case "Vàng":
      if (totalSpending > 8000000) return 0;
      return 8000000 - totalSpending;
    case "Kim cương":
      return 0;
    default:
      return 0;
  }
};

export const CalculatePercentProgress = (rank, totalSpending) => {
  switch (rank) {
    case "Bạc":
      if (totalSpending > 4000000) return 100;
      return (totalSpending / 4000000) * 100;
    case "Vàng":
      if (totalSpending > 8000000) return 100;
      return (totalSpending / 8000000) * 100;
    case "Kim cương":
      return 100;
    default:
      return 0;
  }
};

export const CalculatePercentProgressSilver = (rank, totalSpending) => {
  if (rank === "Bạc") {
    if (totalSpending > 4000000) return 100;
    return (totalSpending / 4000000) * 100;
  }
  return 100;
};

export const CalculatePercentProgressGold = (rank, totalSpending) => {
  if (rank === "Vàng") {
    if (totalSpending > 8000000) return 100;
    return (totalSpending / 8000000) * 100;
  }
  return 100;
};
