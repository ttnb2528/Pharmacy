import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const MobileAddressItem = ({ address, onEdit, onDelete, onSetDefault }) => {
  return (
    <div className="py-4 relative">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="font-medium">{address.name}</span>
          <span className="text-gray-500">|</span>
          <span>{address.phone}</span>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-gray-500"
            onClick={onEdit}
          >
            <Pencil className="h-4 w-4" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-red-500"
            onClick={onDelete}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <p className="text-sm text-gray-600 mb-2">
        {`${address.otherDetails}, ${address.ward}, ${address.district}, ${address.province}`}
      </p>

      <div className="flex items-center justify-between">
        {address.isDefault ? (
          <Badge className="bg-green-100 text-green-600 hover:bg-green-100">
            Mặc định
          </Badge>
        ) : (
          <Button
            variant="ghost"
            size="sm"
            className="text-green-600 p-0 h-auto text-xs"
            onClick={onSetDefault}
          >
            Đặt làm mặc định
          </Button>
        )}
      </div>
    </div>
  );
};

export default MobileAddressItem;
