import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const MobileAccountHeaderChild = ({ title = "Địa chỉ nhận hàng" }) => {
  const navigate = useNavigate();

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
      <h1 className="text-base font-semibold">{title}</h1>
      <div className="w-9"></div> {/* Empty div for alignment */}
    </div>
  );
};

export default MobileAccountHeaderChild;
