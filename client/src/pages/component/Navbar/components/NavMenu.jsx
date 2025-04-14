import { PharmacyContext } from "@/context/Pharmacy.context.jsx";
import { useContext } from "react";
import { Link } from "react-router-dom";
import slugify from "slugify";
import { useTranslation } from "react-i18next";

const NavMenu = () => {
  const { categories } = useContext(PharmacyContext);
  const { t } = useTranslation();

  const getLocalizedSlug = (category) => {
    // Nếu là tiếng Việt hoặc ngôn ngữ khác, giữ nguyên slug gốc
    return slugify(category.name, { lower: true });
  };

  const getCategoryTranslation = (category) => {
    // Sử dụng namespace "categories" kết hợp với tên danh mục làm key
    // Key trong file dịch: categories.Dược Phẩm, categories.Chăm sóc sức khỏe,...
    const translationKey = `categories.${category.name}`;

    // Sử dụng tên danh mục gốc làm giá trị mặc định nếu không tìm thấy bản dịch
    return t(translationKey, { defaultValue: category.name });
  };

  return (
    <nav className="hidden md:flex flex-wrap justify-between text-white mb-2 overflow-x-auto">
      {categories.map((category) => (
        <div className="cate-menu whitespace-nowrap px-2" key={category.id}>
          <span className="root-cate">
            <div className="cursor-pointer">
              <Link to={`/${getLocalizedSlug(category)}`}>
                <strong className="cate-title">
                  {getCategoryTranslation(category)}
                </strong>
              </Link>
            </div>
          </span>
        </div>
      ))}
    </nav>
  );
};

export default NavMenu;
