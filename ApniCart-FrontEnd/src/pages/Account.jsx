import AccountComp from "../components/AccountComp";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

function Account() {
  return (
    <>
      <Navbar />
      <div className="mt-30">
        <AccountComp />
      </div>
      <div className="-mt-50">
      <Footer />
      </div>
    </>
  );
}

export default Account;
