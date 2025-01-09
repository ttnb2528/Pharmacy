import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import user_avatar from "@/assets/user_avatar.jpg";
import CoinSvg from "@/pages/component/CoinSvg.jsx";
import silverCard from "@/assets/silver-background.jpg";
import silverRankIcon from "@/assets/silver-rank.png";
import goldRankIcon from "@/assets/gold-rank.png";

import { Separator } from "@/components/ui/separator.jsx";
import { Progress } from "@/components/ui/progress";
import { NavLink } from "react-router-dom";

const AccountSmall = () => {
  return (
    <div>
      <div className="grid w-[288px] gap-4 rounded-md bg-white">
        <div className="px-4 pt-4">
          <div className="grid gap-4">
            <div className="flex items-center gap-2">
              {/* chỉnh lại lấy ảnh sao */}
              <Avatar className="w-16 h-16 ">
                <AvatarImage
                  src={user_avatar}
                  alt="User avatar"
                  className="object-cover w-full h-full bg-black"
                />
                <AvatarFallback>TT</AvatarFallback>
              </Avatar>

              <div className="flex-1 text-sm font-medium">
                <div className="text-neutral-900 text-base font-bold capitalize">
                  Khach hang
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  <div className="mt-1 flex w-fit items-center gap-1 rounded-full bg-orange-100 px-2 py-1 text-sm font-semibold">
                    <CoinSvg />
                    <span className="font-medium text-neutral-900">
                      0 P-Xu Vàng
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div
              className="rounded-xl bg-cover px-2 py-4"
              style={{ "background-image": `url(${silverCard})` }}
            >
              <div className="mb-9 flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white">
                  <img
                    src={silverRankIcon}
                    alt="silver rank"
                    className=" rounded-full border-2"
                  />
                </div>
                <span className="text-xl font-bold uppercase ">Bạc</span>
              </div>

              <div className="flex items-center gap-2">
                <div className="relative min-w-[30px] overflow-hidden rounded-xl text-center text-[10px] font-semibold h-2 w-[100%] bg-white">
                  <Progress
                    value={50}
                    className="w-full bg-white [&>div]:bg-gray-400"
                  />
                </div>
                <div className="flex w-4 items-center justify-center rounded-full bg-white">
                  <img
                    src={goldRankIcon}
                    alt="gold rank"
                    className="border rounded-full"
                  />
                </div>
              </div>

              <div className="mt-2 flex items-center ">
                <span className="text-xs font-normal ">
                  Chi tiêu thêm 4.000.000&nbsp;₫ để thăng hạng vàng
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
              `block px-4 py-3 ${
                isActive
                  ? "bg-green-50 text-green-500 font-semibold"
                  : "hover:bg-accent"
              }`
            }
          >
            Thông tin cá nhân
          </NavLink>
          <NavLink
            to="/account/history"
            className={({ isActive }) =>
              `block px-4 py-3 ${
                isActive
                  ? "bg-green-50 text-green-500 font-semibold"
                  : "hover:bg-accent"
              }`
            }
          >
            Lịch sử mua hàng
          </NavLink>
          <NavLink
            to="/account/coupons"
            className={({ isActive }) =>
              `block px-4 py-3 ${
                isActive
                  ? "bg-green-50 text-green-500 font-semibold"
                  : "hover:bg-accent"
              }`
            }
          >
            Mã giảm giá
          </NavLink>
          <NavLink
            to="/account/addresses"
            className={({ isActive }) =>
              `block px-4 py-3 ${
                isActive
                  ? "bg-green-50 text-green-500 font-semibold"
                  : "hover:bg-accent"
              }`
            }
          >
            Địa chỉ
          </NavLink>
          <NavLink
            to="/account/points"
            className={({ isActive }) =>
              `block px-4 py-3 ${
                isActive
                  ? "bg-green-50 text-green-500 font-semibold"
                  : "hover:bg-accent"
              }`
            }
          >
            Lịch sử tích điểm
          </NavLink>
          <NavLink
            to="/account/policy"
            className={({ isActive }) =>
              `block px-4 py-3 mb-5 ${
                isActive
                  ? "bg-green-50 text-green-500 font-semibold"
                  : "hover:bg-accent"
              }`
            }
          >
            Quy chế tích điểm
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default AccountSmall;
