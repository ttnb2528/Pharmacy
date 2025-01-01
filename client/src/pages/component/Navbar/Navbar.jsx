import NavMenu from "./components/NavMenu.jsx";
import NavSearch from "./components/NavSearch.jsx";

const Navbar = () => {
  return (
    <header className="w-[80vw] mx-auto flex flex-col">
      <NavSearch />
      <NavMenu />
    </header>
  );
};

export default Navbar;
