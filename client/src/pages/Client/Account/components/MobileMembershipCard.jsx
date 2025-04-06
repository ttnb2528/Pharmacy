import { useAppStore } from "@/store/index.js";
import { Progress } from "@/components/ui/progress";
import {
  CalculatePercentProgress,
  CalculateRemainingAccumulated,
} from "@/utils/Calculate.js";
import { convertVND } from "@/utils/ConvertVND.js";
import { SilverRank, GoldRank } from "@/utils/variableExport.js";

// Import images
import silverCard from "@/assets/silver-background.jpg";
import silverRankIcon from "@/assets/silver-rank.png";
import goldRankIcon from "@/assets/gold-rank.png";
import goldCard from "@/assets/gold-card.png";
import diamondRankIcon from "@/assets/diamond-rank.png";
import diamondCard from "@/assets/diamond-card.png";

const MobileMembershipCard = () => {
  const { userInfo } = useAppStore();
  const rank = userInfo?.accountId?.loyaltyProgramId?.rank;

  return (
    <div className="px-4 pb-4 md:hidden">
      <div
        className="rounded-xl bg-cover px-3 py-4"
        style={{
          backgroundImage: `url(${
            rank === SilverRank
              ? silverCard
              : rank === GoldRank
              ? goldCard
              : diamondCard
          })`,
        }}
      >
        <div className="mb-6 flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white">
            <img
              src={
                rank === SilverRank
                  ? silverRankIcon
                  : rank === GoldRank
                  ? goldRankIcon
                  : diamondRankIcon
              }
              alt="rank icon"
              className="rounded-full border-2"
            />
          </div>
          <span
            className={`text-lg font-bold uppercase ${
              rank === SilverRank ? "" : "text-white"
            }`}
          >
            {rank}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative min-w-[30px] overflow-hidden rounded-xl text-center text-[10px] font-semibold h-2 w-[100%] bg-white">
            <Progress
              value={CalculatePercentProgress(
                userInfo?.accountId?.loyaltyProgramId?.rank,
                userInfo?.accountId?.loyaltyProgramId?.totalSpending
              )}
              className="w-full bg-white [&>div]:bg-gray-400"
            />
          </div>
          <div className="flex w-4 items-center justify-center rounded-full bg-white">
            <img
              src={rank === SilverRank ? goldRankIcon : diamondRankIcon}
              alt="next rank"
              className="border rounded-full"
            />
          </div>
        </div>

        <div className="mt-2">
          <span
            className={`text-xs font-normal ${
              rank === SilverRank ? "" : "text-white"
            }`}
          >
            Chi tiêu thêm{" "}
            {convertVND(
              CalculateRemainingAccumulated(
                userInfo?.accountId?.loyaltyProgramId?.rank,
                userInfo?.accountId?.loyaltyProgramId?.totalSpending
              )
            )}{" "}
            để thăng hạng {rank === SilverRank ? "Vàng" : "Kim cương"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default MobileMembershipCard;
