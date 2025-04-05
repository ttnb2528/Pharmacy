import { useContext } from "react";
import { PharmacyContext } from "@/context/Pharmacy.context.jsx";
import { ShoppingBag, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { convertVND } from "@/utils/ConvertVND.js";
import { CalculateProductWithSale } from "@/utils/Calculate.js";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { useNavigate } from "react-router-dom";
import slugify from "slugify";

const MobileCheckoutProducts = () => {
  const { cart, allProducts, CalculateTotalItems } =
    useContext(PharmacyContext);
  const navigate = useNavigate();

  const handleRouteToProduct = (product) => {
    navigate(
      `/${slugify(product?.categoryId?.name, { lower: true })}/${slugify(
        product?.name,
        { lower: true }
      )}`,
      {
        state: { product },
      }
    );
  };

  return (
    <div className="bg-white p-4 rounded-md">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <ShoppingBag className="h-5 w-5 text-green-600" />
          <h2 className="font-semibold">Sản phẩm</h2>
        </div>

        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="text-green-600 p-0 h-auto flex items-center"
            >
              {CalculateTotalItems(cart)} sản phẩm
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="h-[80vh]">
            <SheetHeader>
              <SheetTitle>Sản phẩm trong đơn hàng</SheetTitle>
            </SheetHeader>

            <div className="py-4 overflow-auto h-[calc(100%-80px)]">
              {allProducts.map(
                (product, index) =>
                  cart[product.id] > 0 && (
                    <div key={product._id}>
                      <div className="py-3">
                        <div className="flex gap-3">
                          <div className="w-20 h-20 border rounded-md overflow-hidden">
                            <img
                              src={product.images[0] || "/placeholder.svg"}
                              alt={product.name}
                              className="w-full h-full object-contain"
                              onClick={() => handleRouteToProduct(product)}
                            />
                          </div>

                          <div className="flex-1">
                            <h3
                              className="font-medium text-sm line-clamp-2"
                              onClick={() => handleRouteToProduct(product)}
                            >
                              {product.name}
                            </h3>

                            <div className="flex justify-between items-end mt-1">
                              <div>
                                {product.isDiscount && (
                                  <p className="text-xs text-gray-500 line-through">
                                    {convertVND(product.batches[0].retailPrice)}
                                  </p>
                                )}
                                <p className="font-medium text-green-600">
                                  {product.isDiscount
                                    ? convertVND(
                                        CalculateProductWithSale(
                                          product.batches[0].retailPrice,
                                          product.discountPercentage
                                        )
                                      )
                                    : convertVND(
                                        product.batches[0].retailPrice
                                      )}
                                </p>
                              </div>

                              <div className="text-sm">x{cart[product.id]}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                      {index <
                        allProducts.filter((p) => cart[p.id] > 0).length -
                          1 && <Separator />}
                    </div>
                  )
              )}
            </div>
          </SheetContent>
        </Sheet>
      </div>

      <div className="overflow-x-auto w-[95vw] pb-2 -mx-1 px-1 max-h-32">
        <div className="flex gap-2 snap-x overflow-x-auto">
          {allProducts.map(
            (product) =>
              cart[product.id] > 0 && (
                <div
                  key={product._id}
                  className="flex-shrink-0 w-16 h-16 border rounded-md overflow-hidden snap-start"
                  onClick={() => handleRouteToProduct(product)}
                >
                  <img
                    src={product.images[0] || "/placeholder.svg"}
                    alt={product.name}
                    className="w-full h-full object-contain"
                  />
                </div>
              )
          )}
        </div>
      </div>
    </div>
  );
};

export default MobileCheckoutProducts;
