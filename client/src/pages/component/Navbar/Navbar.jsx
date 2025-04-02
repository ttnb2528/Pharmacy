import { useState } from "react";
import NavMenu from "./components/NavMenu.jsx";
import NavSearch from "./components/NavSearch.jsx";
import { useMediaQuery } from "@/hook/use-media-query.js";
import MobileNav from "./components/mobileNav.jsx";

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  return (
    <header className="w-full mx-auto flex flex-col px-4 md:px-6 lg:w-[90vw] xl:w-[80vw]">
      <NavSearch
        setMobileMenuOpen={setMobileMenuOpen}
        mobileMenuOpen={mobileMenuOpen}
      />
      {isDesktop ? (
        <NavMenu />
      ) : (
        <MobileNav open={mobileMenuOpen} setOpen={setMobileMenuOpen} />
      )}
    </header>
  );
};

export default Navbar;
