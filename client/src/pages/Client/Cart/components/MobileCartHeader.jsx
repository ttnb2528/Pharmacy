import { ArrowLeft, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useContext, useState } from "react";
import { PharmacyContext } from "@/context/Pharmacy.context.jsx";
import ConfirmForm from "@/pages/component/ConfirmForm.jsx";

const MobileCartHeader = ({ onClearCart }) => {
  const navigate = useNavigate();
  const { CalculateTotalItems, cart } = useContext(PharmacyContext);
  const [confirmDeleteAll, setConfirmDeleteAll] = useState(false);

  const handleConfirmDeleteAllOpen = () => {
    setConfirmDeleteAll(true);
  };

  const handleClearCart = () => {
    onClearCart();
    setConfirmDeleteAll(false);
  };

  const hasItems = Object.values(cart).some((quantity) => quantity > 0);

  return (
    <>
      <div className="sticky top-0 z-10 bg-white p-3 flex items-center justify-between border-b md:hidden">
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>

        <h1 className="text-base font-semibold">
          Giỏ hàng ({CalculateTotalItems(cart)})
        </h1>

        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 text-red-500"
          onClick={handleConfirmDeleteAllOpen}
          disabled={!hasItems}
        >
          <Trash2 className="h-5 w-5" />
        </Button>
      </div>

      <ConfirmForm
        open={confirmDeleteAll}
        onClose={() => setConfirmDeleteAll(false)}
        handleConfirm={handleClearCart}
        type={"product"}
      />
    </>
  );
};

export default MobileCartHeader;
