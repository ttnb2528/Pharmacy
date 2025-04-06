import { NavLink } from "react-router-dom";
import { FaRegUserCircle } from "react-icons/fa";
import { LuNotepadText } from "react-icons/lu";
import { GrMapLocation } from "react-icons/gr";
import { PiMedal, PiHandCoins } from "react-icons/pi";
import { LuTicketPercent } from "react-icons/lu";
import { IoInformationCircleOutline, IoSettingsOutline } from "react-icons/io5";
import { BiCategoryAlt } from "react-icons/bi";

const MobileAccountMenu = () => {
  return (
    <div className="bg-gray-50 pb-20 md:hidden">
      {/* Main sections */}
      <div className="bg-white mb-2 px-4 py-2">
        <h3 className="text-sm font-medium text-gray-500 mb-2">
          Tài khoản của tôi
        </h3>

        <NavLink
          to="/account/info"
          className={({ isActive }) =>
            `flex items-center py-3 ${
              isActive ? "text-green-500 font-semibold" : "text-gray-700"
            }`
          }
        >
          <FaRegUserCircle className="mr-3 text-lg" />
          <span>Thông tin cá nhân</span>
        </NavLink>

        <NavLink
          to="/account/addresses"
          className={({ isActive }) =>
            `flex items-center py-3 ${
              isActive ? "text-green-500 font-semibold" : "text-gray-700"
            }`
          }
        >
          <GrMapLocation className="mr-3 text-lg" />
          <span>Địa chỉ nhận hàng</span>
        </NavLink>

        <NavLink
          to="/account/history"
          className={({ isActive }) =>
            `flex items-center py-3 ${
              isActive ? "text-green-500 font-semibold" : "text-gray-700"
            }`
          }
        >
          <LuNotepadText className="mr-3 text-lg" />
          <span>Đơn hàng của tôi</span>
        </NavLink>

        <NavLink
          to="/account/points"
          className={({ isActive }) =>
            `flex items-center py-3 ${
              isActive ? "text-green-500 font-semibold" : "text-gray-700"
            }`
          }
        >
          <PiHandCoins className="mr-3 text-lg" />
          <span>Lịch sử tích xu</span>
        </NavLink>
      </div>

      {/* Utilities */}
      <div className="bg-white mb-2 px-4 py-2">
        <h3 className="text-sm font-medium text-gray-500 mb-2">Tiện ích</h3>

        <NavLink
          to="/account/coupons"
          className={({ isActive }) =>
            `flex items-center py-3 ${
              isActive ? "text-green-500 font-semibold" : "text-gray-700"
            }`
          }
        >
          <LuTicketPercent className="mr-3 text-lg" />
          <span>Mã giảm giá</span>
        </NavLink>

        <NavLink
          to="/account/policy"
          className={({ isActive }) =>
            `flex items-center py-3 ${
              isActive ? "text-green-500 font-semibold" : "text-gray-700"
            }`
          }
        >
          <PiMedal className="mr-3 text-lg" />
          <span>Quy chế tích điểm</span>
        </NavLink>
      </div>

      {/* General info */}
      <div className="bg-white px-4 py-2">
        <h3 className="text-sm font-medium text-gray-500 mb-2">
          Thông tin chung
        </h3>

        <NavLink
          to="/about"
          className={({ isActive }) =>
            `flex items-center py-3 ${
              isActive ? "text-green-500 font-semibold" : "text-gray-700"
            }`
          }
        >
          <IoInformationCircleOutline className="mr-3 text-lg" />
          <span>Về nhà thuốc</span>
        </NavLink>

        <NavLink
          to="/settings"
          className={({ isActive }) =>
            `flex items-center py-3 ${
              isActive ? "text-green-500 font-semibold" : "text-gray-700"
            }`
          }
        >
          <IoSettingsOutline className="mr-3 text-lg" />
          <span>Cài đặt</span>
        </NavLink>

        <NavLink
          to="/categories"
          className={({ isActive }) =>
            `flex items-center py-3 ${
              isActive ? "text-green-500 font-semibold" : "text-gray-700"
            }`
          }
        >
          <BiCategoryAlt className="mr-3 text-lg" />
          <span>Danh mục</span>
        </NavLink>
      </div>
    </div>
  );
};

export default MobileAccountMenu;
