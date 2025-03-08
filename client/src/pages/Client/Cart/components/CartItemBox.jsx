import { Button } from "@/components/ui/button.jsx";
import { Separator } from "@/components/ui/separator.jsx";
import { FaShippingFast } from "react-icons/fa";
// import testProductImage from "@/assets/test_product_image1.jpg";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input.jsx";
import { FaMinus, FaPlus, FaTrashAlt } from "react-icons/fa";
import { useContext, useEffect, useState } from "react";
import { PharmacyContext } from "@/context/Pharmacy.context.jsx";
import { apiClient } from "@/lib/api-client.js";
import {
  ADD_TO_CART_ROUTE,
  CLEAR_CART_ROUTE,
  REMOVE_FROM_CART_ROUTE,
  REMOVE_PRODUCT_FROM_CART_ROUTE,
  UPDATE_CART_ROUTE,
} from "@/API/index.api.js";
import Loading from "@/pages/component/Loading.jsx";
import { convertVND } from "@/utils/ConvertVND.js";
import {
  CalculateProductWithSale,
  CalculateTotalPrice,
} from "@/utils/Calculate.js";
import ConfirmForm from "@/pages/component/ConfirmForm.jsx";
import { toast } from "sonner";
import slugify from "slugify";

const CartItemBox = () => {
  const { allProducts, cart, setCart, CalculateTotalItems } =
    useContext(PharmacyContext);
  const [isLoading, setIsLoading] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [confirmDeleteAll, setConfirmDeleteAll] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [quantityInput, setQuantityInput] = useState({});

  useEffect(() => {
    const initialQuantities = {};
    Object.keys(cart).forEach((productId) => {
      initialQuantities[productId] = cart[productId];
    });
    setQuantityInput(initialQuantities);
  }, [cart]);

  const navigate = useNavigate();

  const handleIncreaseQuantity = async (product) => {
    try {
      setIsLoading(true);
      const newQuantity = cart[product.id] + 1;
      if (newQuantity > 20) {
        toast.error("Số lượng sản phẩm tối đa là 20");
        const res = await apiClient.post(UPDATE_CART_ROUTE, {
          productId: product.id,
          quantity: 20,
        });

        if (res.status === 200 && res.data.status === 200) {
          setCart((prev) => ({
            ...prev,
            [product.id]: 20,
          }));

          setQuantityInput((prev) => ({
            ...prev,
            [product.id]: 20,
          }));
        }

        return;
      }

      const res = await apiClient.post(ADD_TO_CART_ROUTE, {
        productId: product.id,
        quantity: 1,
      });

      if (res.status === 200 && res.data.status === 200) {
        setCart((prev) => ({
          ...prev,
          [product.id]: prev[product.id] + 1,
        }));
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDecreaseQuantity = async (product) => {
    try {
      setIsLoading(true);
      const newQuantity = cart[product.id] - 1;
      if (newQuantity > 20) {
        toast.error("Số lượng sản phẩm tối đa là 20");
        const res = await apiClient.post(UPDATE_CART_ROUTE, {
          productId: product.id,
          quantity: 20,
        });

        if (res.status === 200 && res.data.status === 200) {
          setCart((prev) => ({
            ...prev,
            [product.id]: 20,
          }));

          setQuantityInput((prev) => ({
            ...prev,
            [product.id]: 20,
          }));
        }

        return;
      }

      const res = await apiClient.post(REMOVE_FROM_CART_ROUTE, {
        productId: product.id,
        quantity: 1,
      });

      if (res.status === 200 && res.data.status === 200) {
        setCart((prev) => ({
          ...prev,
          [product.id]: prev[product.id] - 1,
        }));
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveProduct = async (productId) => {
    try {
      setIsLoading(true);
      const res = await apiClient.post(REMOVE_PRODUCT_FROM_CART_ROUTE, {
        productId,
      });

      if (res.status === 200 && res.data.status === 200) {
        setCart((prev) => ({
          ...prev,
          [productId]: 0,
        }));
        toast.success(res.data.message);
      } else {
        toast.error(res.data.message);
      }

      setConfirmDelete(false);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveAllProducts = async () => {
    try {
      setIsLoading(true);
      const res = await apiClient.post(CLEAR_CART_ROUTE);

      if (res.status === 200 && res.data.status === 200) {
        for (const key in cart) {
          setCart((prev) => ({
            ...prev,
            [key]: 0,
          }));
        }
        toast.success(res.data.message);
      } else {
        toast.error(res.data.message);
      }

      setConfirmDeleteAll(false);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmDeleteOpen = (product) => {
    setConfirmDelete(true);
    setSelectedProductId(product.id);
  };

  const handleConfirmDeleteAllOpen = () => {
    setConfirmDeleteAll(true);
  };

  const handleUpdateQuantity = async (product, newQuantity) => {
    try {
      setIsLoading(true);
      const res = await apiClient.post(UPDATE_CART_ROUTE, {
        productId: product.id,
        quantity: newQuantity,
      });

      if (res.status === 200 && res.data.status === 200) {
        setCart((prev) => ({
          ...prev,
          [product.id]: newQuantity,
        }));

        setQuantityInput({});
        toast.success(res.data.message);
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuantityChange = (productId, value) => {
    // Chỉ cho phép nhập số
    if (value && !/^\d{0,2}$/.test(value)) return;

    setQuantityInput((prev) => ({
      ...prev,
      [productId]: value,
    }));
  };

  const handleQuantityUpdate = (product) => {
    const newQuantity = parseInt(quantityInput[product.id]);

    // Nếu giá trị là rỗng hoặc 0, hiện confirm delete
    if (quantityInput[product.id] === "" || newQuantity === 0) {
      handleConfirmDeleteOpen(product);
      // Reset lại giá trị input về giá trị cũ trong cart
      setQuantityInput((prev) => ({
        ...prev,
        [product.id]: cart[product.id],
      }));
      return;
    }

    // Nếu giá trị không hợp lệ, reset về giá trị cũ
    if (isNaN(newQuantity)) {
      setQuantityInput((prev) => ({
        ...prev,
        [product.id]: cart[product.id],
      }));
      return;
    }

    // Nếu số lượng > 20, giới hạn lại thành 20
    if (newQuantity > 20) {
      handleUpdateQuantity(product, 20);
      setQuantityInput((prev) => ({
        ...prev,
        [product.id]: 20,
      }));
      return;
    }

    // Cập nhật số lượng nếu khác với giá trị hiện tại trong cart
    if (newQuantity !== cart[product.id]) {
      handleUpdateQuantity(product, newQuantity);
    }
  };

  const handleNavigateToProduct = (product) => {
    navigate(
      `/${slugify(product?.categoryId?.name, {
        lower: true,
      })}/${slugify(product?.name, { lower: true })}`,
      { state: { product } }
    );
  };
  return (
    <div className="grid gap-4">
      {isLoading && <Loading />}
      <div className="grid gap-6 rounded-sm bg-white p-4 md:p-6">
        <div className="grid-flow-col items-center justify-between gap-4 hidden md:grid">
          <h1 className="text-base font-semibold text-neutral-900 md:text-2xl md:font-bold">
            Giỏ hàng ({CalculateTotalItems(cart)})
          </h1>
          <Button
            className="relative flex justify-center border-0 shadow-none bg-transparent text-sm font-normal outline-none text-green-500 md:hover:text-green-600 md:text-base hover:bg-transparent p-0"
            onClick={handleConfirmDeleteAllOpen}
            disabled={Object.values(cart).every((quantity) => quantity === 0)}
          >
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
            {allProducts.map(
              (product, index) =>
                cart[product.id] > 0 && (
                  <div key={product._id} className="space-y-4">
                    <div className="grid items-start justify-start gap-2 py-4 md:gap-4 md:p-0 md:grid-cols-[1fr_calc(24rem/16)] grid-cols-[calc(16rem/16)_1fr]">
                      <div className="space-y-2">
                        <div className="grid grid-cols-[calc(68rem/16)_1fr] items-start gap-2">
                          <div className="relative h-[calc(68rem/16)] w-[calc(68rem/16)] rounded-sm border border-neutral-100">
                            <div
                              onClick={() => handleNavigateToProduct(product)}
                              className="w-full h-full cursor-pointer"
                            >
                              <img src={product?.images[0]} alt="" className="w-full h-full object-contain"/>
                            </div>
                          </div>

                          <div className="flex h-full flex-col justify-between md:flex-row md:space-x-4">
                            <div className="grid flex-1 content-start gap-1">
                              <div
                                onClick={() => handleNavigateToProduct(product)}
                              >
                                <p className="line-clamp-2 text-sm font-semibold text-neutral-900">
                                  {product.name}
                                </p>
                              </div>
                              <div className="dropdown text-sm text-neutral-500">
                                Mã sản phẩm: {product.id}
                              </div>
                            </div>

                            <div className="flex h-fit items-center justify-between space-x-4 md:justify-center">
                              <div className="flex flex-col justify-center md:w-[calc(160rem/16)] md:flex-row md:space-x-1">
                                {product.isDiscount && (
                                  <p className="text-base line-through md:text-sm text-neutral-700">
                                    {convertVND(product.batches[0].price)}
                                  </p>
                                )}
                                <p className="text-base font-semibold md:text-sm text-neutral-900">
                                  {convertVND(
                                    CalculateProductWithSale(
                                      product.batches[0].price,
                                      product.discountPercentage
                                    )
                                  )}
                                </p>
                              </div>

                              <div className="flex w-[calc(117rem/16)] items-center justify-end  self-end md:justify-center md:self-center">
                                <div className="relative">
                                  <div className="flex items-center gap-1 text-sm leading-4 h-[34px]">
                                    <Button
                                      className="bg-neutral-300 rounded-full p-1 h-6 w-6 hover:bg-neutral-200"
                                      onClick={() => {
                                        if (cart[product.id] === 1) {
                                          handleConfirmDeleteOpen(product);
                                        } else {
                                          handleDecreaseQuantity(product);
                                        }
                                      }}
                                    >
                                      <FaMinus
                                        style={{
                                          width: "12px",
                                          height: "12px",
                                        }}
                                      />
                                    </Button>
                                    <Input
                                      className="border-none focus-visible:ring-0 shadow-none w-10 font-semibold text-center"
                                      value={quantityInput[product.id] || ""}
                                      onKeyPress={(e) => {
                                        if (e.key === "Enter") {
                                          handleQuantityUpdate(product);
                                        }
                                      }}
                                      onChange={(e) =>
                                        handleQuantityChange(
                                          product.id,
                                          e.target.value
                                        )
                                      }
                                      onBlur={() =>
                                        handleQuantityUpdate(product)
                                      }
                                      maxLength={2}
                                    />
                                    <Button
                                      className="bg-neutral-300 rounded-full p-1 h-6 w-6 hover:bg-neutral-200"
                                      onClick={() =>
                                        handleIncreaseQuantity(product)
                                      }
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
                                  {convertVND(
                                    CalculateTotalPrice(
                                      product.batches[0].price,
                                      product.discountPercentage,
                                      cart[product.id]
                                    )
                                  )}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <Button
                        className="bg-transparent border-none focus-visible:ring-0 text-black hover:bg-transparent hover:text-green-400 shadow-none"
                        onClick={() => handleConfirmDeleteOpen(product)}
                      >
                        <FaTrashAlt className="w-4 h-4 mr-2" />
                      </Button>
                    </div>
                    {index < allProducts.length - 1 && <Separator />}
                  </div>
                )
            )}
          </div>
        </div>
      </div>
      <ConfirmForm
        open={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        handleConfirm={() => handleRemoveProduct(selectedProductId)}
        type={"product"}
      />

      <ConfirmForm
        open={confirmDeleteAll}
        onClose={() => setConfirmDeleteAll(false)}
        handleConfirm={() => handleRemoveAllProducts()}
        type={"product"}
      />
    </div>
  );
};

export default CartItemBox;
