import { Coins, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useAppStore } from "@/store/index.js";

const MobileCheckoutCoins = ({
  coinUsed,
  setCoinUsed,
  tempCoinInput,
  setTempCoinInput,
  handleApplyCoin,
  isOpenCoinGold,
  setIsOpenCoinGold,
  formatNumber,
}) => {
  const { userInfo } = useAppStore();

  return (
    <div className="bg-white p-4 rounded-md">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Coins className="h-5 w-5 text-green-600" />
          <h2 className="font-semibold">Dùng Xu</h2>
        </div>

        <Button
          variant="ghost"
          size="sm"
          className="text-green-600 p-0 h-auto flex items-center"
          onClick={() => setIsOpenCoinGold(true)}
        >
          Tùy chọn
          <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </div>

      <div className="flex justify-between items-center mt-2">
        <p className="text-sm text-gray-600">Xu hiện có</p>
        <p className="font-medium">
          {formatNumber(userInfo?.accountId?.loyaltyProgramId?.points || 0)} Xu
        </p>
      </div>

      {coinUsed > 0 && (
        <div className="flex justify-between items-center mt-1">
          <p className="text-sm text-gray-600">Xu sử dụng</p>
          <p className="font-medium text-green-600">
            {formatNumber(coinUsed)} Xu
          </p>
        </div>
      )}

      <Sheet open={isOpenCoinGold} onOpenChange={setIsOpenCoinGold}>
        <SheetContent side="bottom" className="h-[60vh]">
          <SheetHeader>
            <SheetTitle>Sử dụng Xu</SheetTitle>
          </SheetHeader>

          <div className="py-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="coin-input">Nhập số lượng Xu</Label>
              <Input
                id="coin-input"
                type="number"
                placeholder="Nhập số lượng Xu"
                value={tempCoinInput}
                onChange={(e) => setTempCoinInput(e.target.value)}
              />
            </div>

            <div className="flex justify-between items-center">
              <Label>Xu hiện có</Label>
              <span className="font-semibold">
                {formatNumber(
                  userInfo?.accountId?.loyaltyProgramId?.points || 0
                )}{" "}
                Xu
              </span>
            </div>

            <Separator />

            <p className="text-sm">
              Số Xu sử dụng phải là bội số của 1000 và không vượt quá 50% giá
              trị đơn hàng
            </p>

            {coinUsed > 0 && (
              <div className="bg-green-50 p-3 rounded-md">
                <p className="text-sm text-green-600 font-medium">
                  Đã áp dụng: {formatNumber(coinUsed)} Xu
                </p>
              </div>
            )}
          </div>

          <SheetFooter>
            <Button
              className="w-full bg-green-500 hover:bg-green-600"
              onClick={handleApplyCoin}
            >
              Áp dụng
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default MobileCheckoutCoins;
