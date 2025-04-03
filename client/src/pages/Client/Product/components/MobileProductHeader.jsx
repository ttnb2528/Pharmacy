import { ArrowLeft, ShoppingCart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useContext } from "react";
import { PharmacyContext } from "@/context/Pharmacy.context.jsx";

const MobileProductHeader = ({ title }) => {
  const navigate = useNavigate();
  const { cart } = useContext(PharmacyContext);

  // Calculate total items in cart
  const totalItems = Object.values(cart || {}).reduce(
    (sum, count) => sum + count,
    0
  );

  return (
    <div className="sticky top-0 z-10 bg-white p-3 flex items-center justify-between border-b md:hidden">
      <Button
        variant="ghost"
        size="icon"
        className="h-9 w-9"
        onClick={() => navigate(-1)}
      >
        <ArrowLeft className="h-5 w-5" />
      </Button>

      <h1 className="text-base font-semibold truncate max-w-[60%]">{title}</h1>

      <Button
        variant="ghost"
        size="icon"
        className="h-9 w-9 relative"
        onClick={() => navigate("/cart")}
      >
        <ShoppingCart className="h-5 w-5" />
        {totalItems > 0 && (
          <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-[#26773d]">
            {totalItems > 99 ? "99+" : totalItems}
          </Badge>
        )}
      </Button>
    </div>
  );
};

export default MobileProductHeader;
