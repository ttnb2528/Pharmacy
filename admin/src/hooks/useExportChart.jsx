import { useRef } from "react";
import html2canvas from "html2canvas";
import { format } from "date-fns";

const useExportChart = (fileNamePrefix) => {
  const chartRef = useRef(null);

  const exportChartToPNG = () => {
    if (chartRef.current) {
      // Tạo một container tạm thời để thêm padding
      const tempContainer = document.createElement("div");
      tempContainer.style.padding = "10px"; // Thêm padding 20px cho các cạnh
      tempContainer.style.width = `${chartRef.current.offsetWidth}px`; // Đặt chiều rộng bằng với biểu đồ
      tempContainer.style.backgroundColor = "#fff"; // Đặt nền trắng (tùy chọn)
      document.body.appendChild(tempContainer);

      // Clone biểu đồ và thêm vào container tạm
      const chartClone = chartRef.current.cloneNode(true);
      tempContainer.appendChild(chartClone);

      html2canvas(tempContainer, {
        scale: 2, // Độ phân giải cao
        useCORS: true, // Hỗ trợ nếu có tài nguyên từ nguồn khác
      })
        .then((canvas) => {
          const link = document.createElement("a");
          link.href = canvas.toDataURL("image/png");
          link.download = `${fileNamePrefix}_${format(
            new Date(),
            "yyyy-MM-dd"
          )}.png`;
          link.click();

          // Dọn dẹp container tạm sau khi xuất
          document.body.removeChild(tempContainer);
        })
        .catch((error) => {
          console.error("Lỗi khi xuất biểu đồ:", error);
          document.body.removeChild(tempContainer); // Dọn dẹp nếu lỗi
        });
    } else {
      console.warn("Không tìm thấy biểu đồ để xuất.");
    }
  };

  return { chartRef, exportChartToPNG };
};

export default useExportChart;
