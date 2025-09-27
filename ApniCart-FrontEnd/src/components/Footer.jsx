import React from "react";

const Footer = () => {
  return (
    <footer className="bg-[#232f3e] text-white mt-20">
      {/* Back to Top */}
      <div
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="text-center py-4 bg-[#37475a] text-sm cursor-pointer hover:underline"
      >
        Back to top
      </div>

      {/* Main Footer Links */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 px-6 sm:px-12 py-10 text-sm">
        <div>
          <h3 className="font-bold mb-3">Get to Know Us</h3>
          <ul className="space-y-2">
            <li>About Us</li>
            <li>Careers</li>
            <li>Press Releases</li>
            <li>Amazon Science</li>
          </ul>
        </div>

        <div>
          <h3 className="font-bold mb-3">Connect with Us</h3>
          <ul className="space-y-2">
            <li>Facebook</li>
            <li>Twitter</li>
            <li>Instagram</li>
          </ul>
        </div>

        <div>
          <h3 className="font-bold mb-3">Make Money with Us</h3>
          <ul className="space-y-2">
            <li>Sell on ApniCart</li>
            <li>Affiliate Program</li>
            <li>Advertise Your Products</li>
            <li>Become a Vendor</li>
          </ul>
        </div>

        <div>
          <h3 className="font-bold mb-3">Let Us Help You</h3>
          <ul className="space-y-2">
            <li>Your Account</li>
            <li>Returns Centre</li>
            <li>100% Purchase Protection</li>
            <li>Help</li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar (optional) */}
      <div className="text-center text-xs text-gray-400 border-t border-gray-700 py-4">
        © {new Date().getFullYear()} ApniCart.com, Inc. or its affiliates
      </div>
    </footer>
  );
};

export default Footer;
