import { Outlet } from "react-router-dom";
import AccountSmall from "./components/AccountSmall.jsx";

const Account = () => {
  return (
    <div className="mx-auto max-w-screen-xl md:container md:pb-4">
      <div className="md:mt-6 md:flex md:gap-4">
        <AccountSmall />
        <div className="flex-1 md:max-w-[calc(1200px-288px-16px)]">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Account;
