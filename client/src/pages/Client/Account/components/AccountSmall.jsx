import { Avatar, AvatarImage } from "@/components/ui/avatar";

import CoinSvg from "@/pages/component/CoinSvg.jsx";
import silverCard from "@/assets/silver-background.jpg";
import silverRankIcon from "@/assets/silver-rank.png";
import goldRankIcon from "@/assets/gold-rank.png";
import goldCard from "@/assets/gold-card.png";
import diamondRankIcon from "@/assets/diamond-rank.png";
import diamondCard from "@/assets/diamond-card.png";

import { Separator } from "@/components/ui/separator.jsx";
import { Progress } from "@/components/ui/progress";
import { NavLink } from "react-router-dom";

import { FaRegUserCircle } from "react-icons/fa";
import { LuNotepadText } from "react-icons/lu";
import { GrMapLocation } from "react-icons/gr";
import { PiMedal } from "react-icons/pi";
import { PiHandCoins } from "react-icons/pi";
import { getInitials } from "@/utils/getInitialName.jsx";
import {
  CalculatePercentProgress,
  CalculateRemainingAccumulated,
} from "@/utils/Calculate.js";
import { convertVND } from "@/utils/ConvertVND.js";
import { useAppStore } from "@/store/index.js";
import { GoldRank, SilverRank } from "@/utils/variableExport.js";

const AccountSmall = () => {
  const { userInfo } = useAppStore();
  const rank = userInfo?.accountId?.loyaltyProgramId?.rank;
  return (
    <div>
      <div className="grid w-[288px] gap-4 rounded-md bg-white">
        <div className="px-4 pt-4">
          <div className="grid gap-4">
            <div className="flex items-center gap-2">
              {/* chỉnh lại lấy ảnh sao */}
              <Avatar className="w-16 h-16">
                {userInfo?.avatar ? (
                  <AvatarImage
                    src={userInfo?.avatar}
                    alt="User avatar"
                    className="object-cover w-full h-full bg-black"
                  />
                ) : (
                  <div className="uppercase h-16 w-16 text-xl font-bold border border-green-400 bg-green-400 text-white flex items-center justify-center rounded-full ">
                    {userInfo?.name ? getInitials(userInfo.name) : "KH"}
                  </div>
                )}
              </Avatar>

              <div className="flex-1 text-sm font-medium">
                <div className="text-neutral-900 text-base font-bold capitalize">
                  {userInfo?.name ? userInfo.name : "Khách hàng"}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  <div className="mt-1 flex w-fit items-center gap-1 rounded-full bg-orange-100 px-2 py-1 text-sm font-semibold">
                    <CoinSvg />
                    <span className="font-medium text-neutral-900">
                      {userInfo?.accountId?.loyaltyProgramId?.points} Xu
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div
              className="rounded-xl bg-cover px-2 py-4"
              style={{
                backgroundImage: `url(${
                  rank === SilverRank
                    ? silverCard
                    : rank === GoldRank
                    ? goldCard
                    : diamondCard
                })`,
              }}
              // style={{ backgroundImage: `url(${goldCard})` }}
              // style={{ backgroundImage: `url(${diamondCard})` }}
            >
              <div className="mb-9 flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white">
                  <img
                    src={
                      rank === SilverRank
                        ? silverRankIcon
                        : rank === GoldRank
                        ? goldRankIcon
                        : diamondRankIcon
                    }
                    // src={goldRankIcon}
                    // src={diamondRankIcon}
                    alt="silver rank"
                    className=" rounded-full border-2"
                  />
                </div>
                <span
                  className={`text-xl font-bold uppercase ${
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
                    // src={diamondRankIcon}
                    alt="gold rank"
                    className="border rounded-full"
                  />
                </div>
              </div>

              <div className="mt-2 flex items-center ">
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
        </div>

        <Separator />

        <div>
          <NavLink
            to="/account/info"
            className={({ isActive }) =>
              `px-4 py-3 flex items-center ${
                isActive
                  ? "bg-green-50 text-green-500 font-semibold"
                  : "hover:bg-accent"
              }`
            }
          >
            <FaRegUserCircle className="mr-2" />
            Thông tin cá nhân
          </NavLink>
          <NavLink
            to="/account/history"
            className={({ isActive }) =>
              `flex px-4 py-3 items-center ${
                isActive
                  ? "bg-green-50 text-green-500 font-semibold"
                  : "hover:bg-accent"
              }`
            }
          >
            <LuNotepadText className="mr-2" />
            Lịch sử mua hàng
          </NavLink>
          <NavLink
            to="/account/coupons"
            className={({ isActive }) =>
              `flex px-4 py-3 items-center ${
                isActive
                  ? "bg-green-50 text-green-500 font-semibold"
                  : "hover:bg-accent"
              }`
            }
          >
            <svg
              stroke="currentColor"
              fill="none"
              strokeWidth="2"
              viewBox="0 0 24 24"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-4 h-4 mr-2"
              height="1em"
              width="1em"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M2 9a3 3 0 1 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 1 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"></path>
              <path d="M9 9h.01"></path>
              <path d="m15 9-6 6"></path>
              <path d="M15 15h.01"></path>
            </svg>
            Mã giảm giá
          </NavLink>
          <NavLink
            to="/account/addresses"
            className={({ isActive }) =>
              `flex px-4 py-3 items-center ${
                isActive
                  ? "bg-green-50 text-green-500 font-semibold"
                  : "hover:bg-accent"
              }`
            }
          >
            <GrMapLocation className="mr-2" />
            Địa chỉ
          </NavLink>
          <NavLink
            to="/account/points"
            className={({ isActive }) =>
              `flex px-4 py-3 items-center ${
                isActive
                  ? "bg-green-50 text-green-500 font-semibold"
                  : "hover:bg-accent"
              }`
            }
          >
            <PiHandCoins className="mr-2" />
            Lịch sử tích điểm
          </NavLink>
          <NavLink
            to="/account/policy"
            className={({ isActive }) =>
              `flex px-4 py-3 mb-5 items-center ${
                isActive
                  ? "bg-green-50 text-green-500 font-semibold"
                  : "hover:bg-accent"
              }`
            }
          >
            <PiMedal className="mr-2" />
            Quy chế tích điểm
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default AccountSmall;
