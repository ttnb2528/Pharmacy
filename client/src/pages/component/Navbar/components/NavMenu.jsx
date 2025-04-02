import { PharmacyContext } from "@/context/Pharmacy.context.jsx";
import { useContext } from "react";
import { Link } from "react-router-dom";
import slugify from "slugify";

const NavMenu = () => {
  const { categories } = useContext(PharmacyContext);
  return (
    <nav className="hidden md:flex flex-wrap justify-between text-white mb-2 overflow-x-auto">
      {categories.map((category) => (
        <div className="cate-menu whitespace-nowrap px-2" key={category.id}>
          <span className="root-cate">
            <div className="cursor-pointer">
              <Link to={`/${slugify(category.name, { lower: true })}`}>
                <strong className="cate-title">{category.name}</strong>
              </Link>
            </div>
          </span>
        </div>
      ))}
    </nav>
  );
};

export default NavMenu;
