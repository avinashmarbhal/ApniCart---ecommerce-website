import React from "react";
import AccountDetailsComp from "../components/AccountDetailsComp";
import logo from "../assets/logo-trans.png";
import SimpleFooter from "../components/SimpleFooter";
import { div } from "three/tsl";

function AccountDetails() {
  return (
    <div>
      <div className=" bg-gray-50 flex flex-col items-center -mb-10 mt-10" >
         <img
                  src={logo}
                  alt="ApniCart Logo"
                  className="w-60 h-22 object-cover overflow-hidden"
                />
      </div>
    <div>
      <AccountDetailsComp />
      <SimpleFooter />
    </div>
    </div>
  );
}

export default AccountDetails;
