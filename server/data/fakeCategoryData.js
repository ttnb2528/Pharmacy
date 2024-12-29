export const fakeCategory = [
  {
    name: "Thuoc",
    description: "Mô tả cho danh mục thuoc",
  },
  {
    name: "Thucphamchucnang",
    description: "Mô tả cho danh mục thucphamchucnang",
  },
  {
    name: "Mypham",
    description: "Mô tả cho danh mục mypham",
  },
];

// fakeCategory.forEach(async (category) => {
//   try {
//     const response = await fetch("http://localhost:3000/api/v1/category/addCategory", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(category),
//     });

//     const data = await response.json();
//     console.log(data);
//   } catch (error) {
//     console.error("Lỗi khi thêm thương hiệu:", error);
//   }
// });
