import { Button } from "@/components/ui/button.jsx";
import { Separator } from "@/components/ui/separator.jsx";
import { FaShippingFast } from "react-icons/fa";
import testProductImage from "@/assets/test_product_image1.jpg";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input.jsx";
import { FaMinus, FaPlus, FaTrashAlt } from "react-icons/fa";
import { useState } from "react";

const CartItemBox = () => {
  const allProducts = [1, 2, 3];
  const [quantity, setQuantity] = useState(1);

  const handleIncreaseQuantity = () => {
    setQuantity((prev) => prev + 1);
  };

  const handleDecreaseQuantity = () => {
    setQuantity((prev) => (prev > 1 ? prev - 1 : prev));
  };
  return (
    <div className="grid gap-4">
      <div className="grid gap-6 rounded-sm bg-white p-4 md:p-6">
        <div className="grid-flow-col items-center justify-between gap-4 hidden md:grid">
          <h1 className="text-base font-semibold text-neutral-900 md:text-2xl md:font-bold">
            Giỏ hàng (1)
          </h1>
          <Button className="relative flex justify-center border-0 shadow-none bg-transparent text-sm font-normal outline-none text-green-500 md:hover:text-green-600 md:text-base hover:bg-transparent p-0">
            Xóa
          </Button>
        </div>

        <div className="grid gap-2 md:gap-6">
          <div className="grid grid-cols-[24px_1fr] items-center gap-2 rounded-xl bg-green-50 py-4 pe-4 ps-3 md:rounded-sm md:p-2">
            <div className="relative h-6 w-6">
              <FaShippingFast className="w-6 h-6" />
            </div>
            <p className="line-clamp-3 text-sm font-medium text-neutral-900">
              Miễn phí vận chuyển cho mọi đơn hàng từ 0đ
            </p>
          </div>

          <div className="grid gap-4">
            <div className="hidden  grid-cols-[1fr_calc(24rem/16)] items-center gap-4 md:grid">
              <div className="flex items-center justify-between space-x-4">
                <div className="grid flex-1 items-start gap-2">
                  <p className="text-sm leading-4 text-neutral-900">Sản phẩm</p>
                </div>
                <div className="flex  justify-center space-x-4">
                  <p className="w-[calc(160rem/16)] text-center text-sm text-neutral-900">
                    Đơn giá
                  </p>
                  <p className="w-[calc(117rem/16)] text-center text-sm text-neutral-900">
                    Số lượng
                  </p>
                  <p className="w-[calc(120rem/16)] text-end text-sm text-neutral-900">
                    Thành tiền
                  </p>
                </div>
              </div>
              <div className="w-4"></div>
            </div>
            <Separator />
            {allProducts.map((product, index) => (
              <div key={index} className="space-y-4">
                <div className="grid items-start justify-start gap-2 py-4 md:gap-4 md:p-0 md:grid-cols-[1fr_calc(24rem/16)] grid-cols-[calc(16rem/16)_1fr]">
                  <div className="space-y-2">
                    <div className="grid grid-cols-[calc(68rem/16)_1fr] items-start gap-2">
                      <div className="relative h-[calc(68rem/16)] w-[calc(68rem/16)] rounded-sm border border-neutral-100">
                        <Link to="/product/123">
                          <img src={testProductImage} alt="" />
                        </Link>
                      </div>

                      <div className="flex h-full flex-col justify-between md:flex-row md:space-x-4">
                        <div className="grid flex-1 content-start gap-1">
                          <Link to="/product/123">
                            <p className="line-clamp-2 text-sm font-semibold text-neutral-900">
                              Dung dịch Neopeptine F hỗ trợ tiêu hóa (Chai 15ml)
                            </p>
                          </Link>
                          <div className="dropdown text-sm text-neutral-500">
                            Mã sản phẩm: 123
                          </div>
                        </div>

                        <div className="flex h-fit items-center justify-between space-x-4 md:justify-center">
                          <div className="flex flex-col justify-center md:w-[calc(160rem/16)] md:flex-row md:space-x-1">
                            <p className="text-base line-through md:text-sm text-neutral-700">
                              150.000&nbsp;₫
                            </p>
                            <p className="text-base font-semibold md:text-sm text-neutral-900">
                              56.000&nbsp;₫
                            </p>
                          </div>

                          <div className="flex w-[calc(117rem/16)] items-center justify-end  self-end md:justify-center md:self-center">
                            <div className="relative">
                              <div className="flex items-center gap-1 text-sm leading-4 h-[34px]">
                                <Button
                                  className="bg-neutral-300 rounded-full p-1 h-6 w-6 hover:bg-neutral-200"
                                  onClick={handleDecreaseQuantity}
                                >
                                  <FaMinus
                                    style={{
                                      width: "12px",
                                      height: "12px",
                                    }}
                                  />
                                </Button>
                                <Input
                                  className="border-none focus-visible:ring-0 shadow-none w-8 font-semibold"
                                  value={quantity}
                                />
                                <Button
                                  className="bg-neutral-300 rounded-full p-1 h-6 w-6 hover:bg-neutral-200"
                                  onClick={handleIncreaseQuantity}
                                >
                                  <FaPlus
                                    style={{
                                      width: "12px",
                                      height: "12px",
                                    }}
                                  />
                                </Button>
                              </div>
                            </div>
                          </div>

                          <div className="hidden w-[calc(120rem/16)] items-center justify-end md:flex">
                            <p className="text-sm font-semibold text-neutral-900">
                              112.500&nbsp;₫
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Button className="bg-transparent border-none focus-visible:ring-0 text-black hover:bg-transparent hover:text-green-400 shadow-none">
                    <FaTrashAlt className="w-4 h-4 mr-2" />
                  </Button>
                </div>
                {index < allProducts.length - 1 && <Separator />}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItemBox;
