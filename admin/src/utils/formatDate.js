export const formatDate = (date) => {
  return date ? new Date(date).toLocaleDateString("vi-VN") : "N/A";
};
