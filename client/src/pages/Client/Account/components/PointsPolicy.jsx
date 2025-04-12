import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import { CheckCircle2, Gift, CreditCard, Diamond } from "lucide-react";
import silverBackground from "@/assets/silver-background.jpg";
import goldBackground from "@/assets/gold-card.png";
import diamondBackground from "@/assets/diamond-card.png";
import silverIcon from "@/assets/silver-rank.png";
import goldIcon from "@/assets/gold-rank.png";
import diamondIcon from "@/assets/diamond-rank.png";
import { Progress } from "@/components/ui/progress.jsx";
import {
  CalculatePercentProgressGold,
  CalculatePercentProgressSilver,
  CalculateRemainingAccumulated,
} from "@/utils/Calculate.js";
import { convertVND } from "@/utils/ConvertVND.js";
import { useAppStore } from "@/store/index.js";
import { GoldRank, SilverRank } from "@/utils/variableExport.js";
import { useMediaQuery } from "@/hook/use-media-query.js";
import MobileAccountHeaderChild from "./MobileAccountHeaderChild.jsx";

const TierContent = ({ upgradeCriteria, benefits }) => (
  <Card className="rounded-none border-t-0">
    <CardHeader>
      {upgradeCriteria && (
        <>
          <div className="font-semibold">Điều kiện thăng hạng:</div>
          <CardDescription className="ml-4">
            - {upgradeCriteria}
          </CardDescription>
        </>
      )}
    </CardHeader>
    <CardContent>
      <h4 className="font-semibold mb-2">Đặc quyền ưu đãi:</h4>
      <ul className="space-y-2">
        {benefits.map((benefit, index) => (
          <li key={index} className="flex items-start">
            <CheckCircle2 className="h-5 w-5 mr-2 text-green-500 flex-shrink-0 mt-0.5" />
            <span>{benefit}</span>
          </li>
        ))}
      </ul>
    </CardContent>
  </Card>
);

const MembershipCard = ({ rank, totalSpending }) => {
  const getRankIcon = () => {
    switch (rank) {
      case SilverRank:
        return silverIcon;
      case GoldRank:
        return goldIcon;
      default:
        return diamondIcon;
    }
  };

  const getNextRankIcon = () => {
    switch (rank) {
      case SilverRank:
        return goldIcon;
      case GoldRank:
        return diamondIcon;
      default:
        return diamondIcon;
    }
  };

  const getNextRankName = () => {
    switch (rank) {
      case SilverRank:
        return "Vàng";
      case GoldRank:
        return "Kim Cương";
      default:
        return "Kim Cương";
    }
  };

  const getBackgroundImage = () => {
    switch (rank) {
      case SilverRank:
        return silverBackground;
      case GoldRank:
        return goldBackground;
      default:
        return diamondBackground;
    }
  };

  const getTextColor = () => {
    return rank === SilverRank ? "text-gray-800" : "text-white";
  };

  return (
    <div className="h-fit relative rounded-lg shadow-lg mb-6">
      <div
        className="bg-center rounded-md bg-cover px-6 py-4"
        style={{
          backgroundImage: `url("${getBackgroundImage()}")`,
        }}
      >
        <div className={`flex flex-col ${getTextColor()}`}>
          <div className="flex items-center gap-2 mb-2">
            <img
              src={getRankIcon() || "/placeholder.svg"}
              alt={`${rank} icon`}
              className="w-8 h-8"
            />
            <span className="text-lg font-bold uppercase">{rank}</span>
          </div>

          <p className="text-sm">
            {rank === "Kim Cương"
              ? "Bạn đang là thành viên hạng cao nhất"
              : `Cần chi tiêu thêm ${convertVND(
                  CalculateRemainingAccumulated(rank, totalSpending)
                )} để thăng hạng ${getNextRankName()}`}
          </p>
        </div>
      </div>
    </div>
  );
};

const DesktopProgressBar = ({ rank, totalSpending }) => (
  <div className="absolute top-10 flex h-20 w-full flex-col items-center justify-center px-6">
    <div className="flex w-full items-center justify-center">
      <div className="flex h-8 w-8 flex-col items-start justify-between gap-2 rounded-full shadow-lg ">
        <img src={silverIcon || "/placeholder.svg"} alt="" />
        <span className="w-24 text-left text-base font-semibold uppercase">
          Bạc
        </span>
      </div>
      <div className="relative min-w-[30px] overflow-hidden py-[2px] text-center text-[10px] font-semibold h-2 w-[100%] rounded-none bg-neutral-200">
        <Progress
          value={CalculatePercentProgressSilver(rank, totalSpending)}
          className="w-full bg-white [&>div]:bg-gray-400"
        />
      </div>
      <div className="flex h-8 w-8 flex-col items-start justify-between gap-2 rounded-full shadow-lg ">
        <img src={goldIcon || "/placeholder.svg"} alt="" />
        <span className="w-auto text-center text-base font-semibold uppercase">
          Vàng
        </span>
      </div>
      <div className="relative min-w-[30px] overflow-hidden py-[2px] text-center text-[10px] font-semibold h-2 w-[100%] rounded-none bg-neutral-200">
        <Progress
          value={CalculatePercentProgressGold(rank, totalSpending)}
          className="w-full bg-white [&>div]:bg-gray-400"
        />
      </div>
      <div className="flex h-8 w-8 flex-col items-end justify-between gap-2 rounded-full shadow-lg">
        <img
          src={diamondIcon || "/placeholder.svg"}
          alt=""
          className="min-w-[2rem]"
        />
        <span className="w-24 text-right text-base font-semibold uppercase">
          Kim cương
        </span>
      </div>
    </div>
  </div>
);

const PointsPolicy = () => {
  const { userInfo } = useAppStore();
  const isMobile = useMediaQuery("(max-width: 640px)");
  const rank = userInfo?.accountId?.loyaltyProgramId?.rank;
  const totalSpending =
    userInfo?.accountId?.loyaltyProgramId?.totalSpending || 0;

  const tiers = [
    {
      id: "bac",
      title: "Hạng Bạc",
      icon: CreditCard,
      benefits: ["Tích P-Xu Vàng 1%", "Ưu đãi đến 50%", "Quà tặng bất ngờ"],
    },
    {
      id: "vang",
      title: "Hạng Vàng",
      icon: Gift,
      upgradeCriteria:
        "Khách hàng có mức chi tiêu tích lũy từ 4.000.000 ₫ trở lên trong vòng 1 năm sẽ được nâng hạng Hạng Vàng",
      benefits: ["Tích P-Xu Vàng 1.5%", "Ưu đãi đến 50%", "Quà tặng bất ngờ"],
    },
    {
      id: "kimcuong",
      title: "Hạng Kim Cương",
      icon: Diamond,
      upgradeCriteria:
        "Khách hàng có mức chi tiêu tích lũy từ 8.000.000 ₫ trở lên trong vòng 1 năm sẽ được nâng hạng Hạng Kim Cương",
      benefits: ["Tích P-Xu Vàng 2%", "Ưu đãi đến 50%", "Quà tặng bất ngờ"],
    },
  ];

  return (
    <div>
      {isMobile && <MobileAccountHeaderChild title="Quy chế tích điểm" />}

      {!isMobile && (
        <h2 className="text-xl font-semibold mb-4">Quy chế tích điểm</h2>
      )}

      <div className="bg-white rounded-lg">
        <div className="grid h-auto gap-0">
          <div className="rounded-tl rounded-tr bg-white p-4">
            {isMobile ? (
              // Mobile view - simplified card with rank icon and text
              <MembershipCard rank={rank} totalSpending={totalSpending} />
            ) : (
              // Desktop view - progress bar visualization
              <div className="h-fit relative rounded-lg shadow-lg">
                <div
                  className="bg-center h-20 rounded-md bg-cover px-6"
                  style={{
                    backgroundImage: `url("${
                      rank === SilverRank
                        ? silverBackground
                        : rank === GoldRank
                        ? goldBackground
                        : diamondBackground
                    }")`,
                  }}
                >
                  <p
                    className={`flex items-center gap-2 pt-4 text-base font-semibold ${
                      rank === SilverRank ? "" : "text-white"
                    }`}
                  >
                    Hạng thành viên{" "}
                    <span className="text-2xl font-bold uppercase">{rank}</span>
                  </p>
                </div>

                <DesktopProgressBar rank={rank} totalSpending={totalSpending} />

                <div className="grid gap-1 px-6 pb-4 pt-14">
                  <div className="grid gap-1 text-sm text-left">
                    <p>
                      Chi tiêu thêm{" "}
                      {convertVND(
                        CalculateRemainingAccumulated(rank, totalSpending)
                      )}{" "}
                      để thăng hạng
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <Tabs
          defaultValue="bac"
          className="w-full bg-white rounded-lg overflow-hidden p-4 pt-0 space-y-0"
        >
          <TabsList className="grid w-full grid-cols-3 bg-white border-x border-t rounded-t rounded-b-none shadow">
            {tiers.map((tier) => (
              <TabsTrigger
                key={tier.id}
                value={tier.id}
                className="data-[state=active]:border-b-2 data-[state=active]:border-green-500 data-[state=active]:shadow-none data-[state=active]:rounded-none rounded-none data-[state=active]:text-green-500 text-neutral-900"
              >
                {tier.title}
              </TabsTrigger>
            ))}
          </TabsList>

          {tiers.map((tier) => (
            <TabsContent key={tier.id} value={tier.id} className="shadow-lg">
              <TierContent {...tier} />
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
};

export default PointsPolicy;
