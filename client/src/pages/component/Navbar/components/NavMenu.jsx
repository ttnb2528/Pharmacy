import { PharmacyContext } from "@/context/Pharmacy.context.jsx";
import { useContext } from "react";
import { Link } from "react-router-dom";
import slugify from "slugify";

const NavMenu = () => {
  const { categories } = useContext(PharmacyContext);
  return (
    <div className="main-menu flex justify-between text-white mb-2">
      {categories.map((category) => (
        <div className="cate-menu" key={category.id}>
          <span className="root-cate">
            <div className="cursor-pointer">
              <Link to={`/${slugify(category.name, { lower: true })}`}>
                <strong className="cate-title">{category.name}</strong>
              </Link>
            </div>
          </span>
        </div>
      ))}
      {/* <div className="cate-menu">
        <span className="root-cate">
          <div className="cursor-pointer">
            <Link to={"/Duoc-pham"}>
              <strong className="cate-title">Dược Phẩm</strong>
            </Link>
          </div>
        </span>
      </div>

      <div className="cate-menu">
        <span className="root-cate">
          <div className="cursor-pointer">
            <Link to={"/Cham-soc-suc-khoe"}>
              <strong className="cate-title">Chăm sóc sức khoẻ</strong>
            </Link>
          </div>
        </span>
      </div>

      <div className="cate-menu">
        <span className="root-cate">
          <div className="cursor-pointer">
            <Link to={"/Cham-soc-ca-nhan"}>
              <strong className="cate-title">Chăm sóc cá nhân</strong>
            </Link>
          </div>
        </span>
      </div>

      <div className="cate-menu">
        <span className="root-cate">
          <div className="cursor-pointer">
            <Link to={"/San-pham-tien-loi"}>
              <strong className="cate-title">Sản phẩm tiện lợi</strong>
            </Link>
          </div>
        </span>
      </div>

      <div className="cate-menu">
        <span className="root-cate">
          <div className="cursor-pointer">
            <Link to={"/Thuc-pham-chuc-nang"}>
              <strong className="cate-title">thực phẩm chức năng</strong>
            </Link>
          </div>
        </span>
      </div>

      <div className="cate-menu">
        <span className="root-cate">
          <div className="cursor-pointer">
            <Link to={"/Me-va-Be"}>
              <strong className="cate-title">Mẹ và Bé</strong>
            </Link>
          </div>
        </span>
      </div>

      <div className="cate-menu">
        <span className="root-cate">
          <div className="cursor-pointer">
            <Link to={"/Cham-soc-nhan-sac"}>
              <strong className="cate-title ">Chăm sóc nhan sắc</strong>
            </Link>
          </div>
        </span>
      </div>

      <div className="cate-menu">
        <span className="root-cate">
          <div className="cursor-pointer">
            <Link to={"/Thiet-bi-y-te"}>
              <strong className="cate-title ">Thiết bị y tế</strong>
            </Link>
          </div>
        </span>
      </div> */}
    </div>
  );
};

export default NavMenu;
