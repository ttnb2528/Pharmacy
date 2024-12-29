export const generateID = async (name) => {
  try {
    const data = await name.find({}).sort({ id: -1 }).limit(1);

    if (data.length > 0) {
      return data[0].id + 1;
    } else {
      return 1;
    }
  } catch (error) {
    console.error("Lỗi khi generate ID:", error);
    return 1;
  }
};
