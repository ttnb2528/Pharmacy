import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import { CheckCircle2, Gift, CreditCard, Diamond } from "lucide-react";
import silverBackground from "@/assets/silver-background.jpg";
import silverIcon from "@/assets/silver-rank.png";
import goldIcon from "@/assets/gold-rank.png";
import diamondIcon from "@/assets/diamond-rank.png";
import { Progress } from "@/components/ui/progress.jsx";
import { useContext } from "react";
import { PharmacyContext } from "@/context/Pharmacy.context.jsx";
import {
  CalculatePercentProgressGold,
  CalculatePercentProgressSilver,
  CalculateRemainingAccumulated,
} from "@/utils/Calculate.js";
import { convertVND } from "@/utils/ConvertVND.js";

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

const PointsPolicy = () => {
  const { userData } = useContext(PharmacyContext);
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
      <h2 className="text-xl font-semibold mb-4">Quy chế tích điểm</h2>
      <div className="bg-white rounded-lg">
        <div className="grid h-auto gap-0">
          <div className="rounded-tl rounded-tr bg-white p-4">
            <div className="">
              <div className="h-fit relative rounded-lg shadow-lg ">
                <div
                  className="bg-center h-20 rounded-md bg-cover px-6"
                  style={{
                    backgroundImage: `url("${silverBackground}")`,
                  }}
                >
                  <p className="flex items-center gap-2 pt-4 text-base font-semibold ">
                    Hạng thành viên{" "}
                    <span className="text-2xl font-bold uppercase">
                      {userData?.accountId?.loyaltyProgramId?.rank}
                    </span>
                  </p>
                </div>

                <div className="absolute top-10 flex h-20 w-full flex-col items-center justify-center px-6">
                  <div className="flex w-full items-center justify-center">
                    <div className="flex h-8 w-8 flex-col items-start justify-between gap-2 rounded-full shadow-lg ">
                      <img src={silverIcon} alt="" />
                      <span className="w-24 text-left text-base font-semibold uppercase">
                        Bạc
                      </span>
                    </div>
                    <div className="relative min-w-[30px] overflow-hidden py-[2px] text-center text-[10px] font-semibold h-2 w-[100%] rounded-none bg-neutral-200">
                      <Progress
                        value={CalculatePercentProgressSilver(
                          userData?.accountId?.loyaltyProgramId?.rank,
                          userData?.accountId?.loyaltyProgramId?.totalSpending
                        )}
                        className="w-full bg-white [&>div]:bg-gray-400"
                      />
                    </div>
                    <div className="flex h-8 w-8 flex-col items-start justify-between gap-2 rounded-full shadow-lg ">
                      <img src={goldIcon} alt="" />
                      <span className="w-auto text-center text-base font-semibold uppercase">
                        Vàng
                      </span>
                    </div>
                    <div className="relative min-w-[30px] overflow-hidden py-[2px] text-center text-[10px] font-semibold h-2 w-[100%] rounded-none bg-neutral-200">
                      <Progress
                        value={CalculatePercentProgressGold(
                          userData?.accountId?.loyaltyProgramId?.rank,
                          userData?.accountId?.loyaltyProgramId?.totalSpending
                        )}
                        className="w-full bg-white [&>div]:bg-gray-400"
                      />
                    </div>
                    <div className="flex h-8 w-8 flex-col items-end justify-between gap-2 rounded-full shadow-lg">
                      <img src={diamondIcon} alt="" className="min-w-[2rem]" />
                      <span className="w-24 text-right text-base font-semibold uppercase">
                        Kim cương
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid gap-1 px-6 pb-4 pt-14">
                  <div className="grid gap-1 text-sm text-left">
                    <p>
                      Chi tiêu thêm{" "}
                      {convertVND(
                        CalculateRemainingAccumulated(
                          userData?.accountId?.loyaltyProgramId?.rank,
                          userData?.accountId?.loyaltyProgramId?.totalSpending
                        )
                      )}{" "}
                      để thăng hạng
                    </p>
                  </div>
                </div>
              </div>
            </div>
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
                className="data-[state=active]:border-b-2 data-[state=active]:border-green-500 data-[state=active]:shadow-none data-[state=active]:rounded-none rounded-none data-[state=active]:text-green-500 text-neutral-900 "
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
