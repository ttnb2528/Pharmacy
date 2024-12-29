export const fakeBrands = [
  {
    name: "Thương hiệu A",
    description: "Mô tả thương hiệu A",
  },
  {
    name: "Thương hiệu B",
    description:
      "Mô tả thương hiệu B, chuyên sản xuất các sản phẩm chất lượng cao",
  },
  {
    name: "Thương hiệu C",
  },
  {
    name: "Thương hiệu D",
    description: "Mô tả thương hiệu D, với nhiều năm kinh nghiệm trong ngành",
  },
];

  // fakeBrands.forEach(async (brand) => {
  //   try {
  //     const response = await fetch("http://localhost:3000/api/v1/brand/addBrand", {
  //       // Thay /api/brands bằng endpoint của bạn
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify(brand),
  //     });

  //     const data = await response.json();
  //     console.log(data);
  //   } catch (error) {
  //     console.error("Lỗi khi thêm thương hiệu:", error);
  //   }
  // });
