import { Avatar } from "@/components/ui/avatar";
import { useAppStore } from "@/store/index.js";
import { getInitials } from "@/utils/getInitialName.jsx";
import CoinSvg from "@/pages/component/CoinSvg.jsx";

const MobileAccountHeader = () => {
  const { userInfo } = useAppStore();

  return (
    <div className="bg-white p-4 flex items-center gap-3 md:hidden">
      {userInfo?.avatar ? (
        <Avatar className="h-16 w-16">
          <img
            src={userInfo.avatar || "/placeholder.svg"}
            alt="User avatar"
            className="h-full w-full object-cover rounded-full"
          />
        </Avatar>
      ) : (
        <div className="uppercase h-16 w-16 text-xl font-bold border border-green-400 bg-green-400 text-white flex items-center justify-center rounded-full">
          {userInfo?.name ? getInitials(userInfo.name) : "KH"}
        </div>
      )}

      <div className="flex-1">
        <h2 className="font-semibold text-lg capitalize">
          {userInfo?.name || "Khách hàng"}
        </h2>
        <div className="flex items-center gap-1 mt-1 bg-orange-100 rounded-full px-2 py-1 w-fit">
          <CoinSvg />
          <span className="text-sm font-medium">
            {userInfo?.accountId?.loyaltyProgramId?.points || 0} Xu
          </span>
        </div>
      </div>
    </div>
  );
};

export default MobileAccountHeader;
