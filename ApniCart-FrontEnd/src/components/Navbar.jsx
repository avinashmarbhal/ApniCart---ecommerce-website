import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { FaShoppingCart, FaBars, FaMapMarkerAlt } from "react-icons/fa";
import SearchIcon from "../assets/SearchIcon";
import logo from "../assets/logo.png";
import SidebarMenu from "../components/SidebarMenu";
import useCategoryData from "../hooks/useCategoryData";
import LogoutButton from "../components/LogoutButton";
import axios from "axios";
import Overlay from "../components/Overlay";

const api = import.meta.env.VITE_API_URL;

const Navbar = () => {
  const { totalItems } = useSelector((state) => state.cart);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showLowerNav, setShowLowerNav] = useState(true);
  const [showOverlay, setShowOverlay] = useState(false);
  const timeoutRef = useRef(null);
  const lastScrollY = useRef(0);
  const navigate = useNavigate();
  const location = useLocation();

  const user = useSelector((state) => state.auth.user);
  const defaultAddress = useSelector((state) => state.address.address);
  const { categories, loading } = useCategoryData();

  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > lastScrollY.current) {
        setShowLowerNav(false);
      } else {
        setShowLowerNav(true);
      }
      lastScrollY.current = window.scrollY;
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!searchTerm.trim()) {
        setSuggestions([]);
        setShowSuggestions(false);
        return;
      }

      try {
        const res = await axios.get(
          `${api}/product/getSuggestions?search=${encodeURIComponent(searchTerm)}`
        );
        const result = res.data.suggestions?.map((item) => item.productName) || [];
        setSuggestions(result);
        setShowSuggestions(true);
      } catch (error) {
        console.error("Error fetching suggestions:", error);
        setSuggestions([]);
        setShowSuggestions(false);
      }
    };

    const delayDebounce = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(delayDebounce);
  }, [searchTerm]);

  const handleSuggestionClick = (term) => {
    setSearchTerm("");
    setShowSuggestions(false);
    const encodedTerm = encodeURIComponent(term);
    if (location.pathname.includes("/manage-product")) {
      navigate(`/manage-product?search=${encodedTerm}`);
    } else {
      navigate(`/s-products?search=${encodedTerm}`);
    }
  };

  const handleSearchSubmit = () => {
    if (searchTerm.trim()) {
      handleSuggestionClick(searchTerm);
    }
  };

  const handleMouseEnter = () => {
    clearTimeout(timeoutRef.current);
    setShowDropdown(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setShowDropdown(false);
    }, 100);
  };

  return (
    <>
      <div className="w-full shadow-md fixed top-0 left-0 z-50 bg-white">
        {/* TOP NAVBAR */}
        <div className="bg-gray-900 text-white px-4 py-2 relative space-y-2">
          {/* Mobile/Tablet Layout */}
          <div className="flex flex-col md:hidden space-y-2">
            <div className="flex items-center justify-between">
              <Link to="/" className="mr-2">
                <img src={logo} alt="Logo" className="w-24 h-8 object-cover" />
              </Link>

              <Link to={user ? "/account" : "/login"} className="flex flex-col items-end text-xs leading-tight -mr-28">
                <span>Hello, {user?.firstName || "Guest"}</span>
                <span className="font-bold text-white">Account & Lists</span>
              </Link>

              <Link to="/cart" className="relative ml-2">
                <FaShoppingCart className="text-2xl" />
                <span className="absolute -top-2 -right-2 bg-yellow-400 text-black text-xs font-bold px-1 rounded-full">
                  {totalItems || ""}
                </span>
              </Link>
            </div>

            <div className="relative w-full">
              <div className="flex">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearchSubmit()}
                  placeholder="Search ApniCart.in"
                  className="w-full py-2 px-4 rounded-l-md focus:outline-none text-black bg-gray-300"
                />
                <button
                  onClick={handleSearchSubmit}
                  className="bg-orange-400 px-4 py-2 rounded-r-md hover:bg-orange-500"
                >
                  <SearchIcon />
                </button>
              </div>
              {showSuggestions && suggestions.length > 0 && (
                <ul className="absolute z-50 top-full left-0 right-0 bg-white shadow-md text-black max-h-60 overflow-y-auto rounded-b-md">
                  {suggestions.map((sug, idx) => (
                    <li
                      key={idx}
                      onClick={() => handleSuggestionClick(sug)}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    >
                      {sug}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* Desktop Layout */}
          <div className="hidden md:flex items-center justify-between">
            <Link to="/" className="flex items-center text-white text-xl rounded-sm font-bold mr-4">
              <img src={logo} alt="Logo" className="w-28 h-10 object-cover" />
            </Link>

            <button
              onClick={() => setShowOverlay(true)}
              className="flex items-center border border-transparent rounded-sm hover:border-white p-1 text-sm mr-4"
            >
              <FaMapMarkerAlt className="mr-1" />
              <div>
                <div className="text-gray-300 text-xs">Deliver to</div>
                <div className="font-semibold">
                  {defaultAddress
                    ? `${defaultAddress.city} ${defaultAddress.pinCode}`
                    : "Select Address"}
                </div>
              </div>
            </button>

            {/* Search */}
            <div className="flex-grow mx-4 relative">
              <div className="flex">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearchSubmit()}
                  placeholder="Search ApniCart.in"
                  className="w-full py-2 px-4 rounded-l-md focus:outline-none text-black bg-gray-300"
                />
                <button
                  onClick={handleSearchSubmit}
                  className="bg-orange-400 px-4 py-2 rounded-r-md hover:bg-orange-500"
                >
                  <SearchIcon />
                </button>
              </div>
              {showSuggestions && suggestions.length > 0 && (
                <ul className="absolute z-50 top-full left-0 right-0 bg-white shadow-md text-black max-h-60 overflow-y-auto rounded-b-md">
                  {suggestions.map((sug, idx) => (
                    <li
                      key={idx}
                      onClick={() => handleSuggestionClick(sug)}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    >
                      {sug}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Account & Orders */}
            <div
              className="relative text-sm mr-4 border border-transparent rounded-sm hover:border-white p-1"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <Link to={user ? "/account" : "/login"} onClick={() => setShowDropdown(false)}>
                <div>Hello, {user?.firstName || "Guest"}</div>
                <div className="font-bold">Account & Lists</div>
              </Link>
              {showDropdown && (
                <div className="absolute right-0 top-full mt-2 w-80 bg-white text-black shadow-lg p-4 rounded z-50">
                  {!user ? (
                    <div className="text-center border-b pb-3 mb-3">
                      <button
                        onClick={() => {
                          setShowDropdown(false);
                          navigate("/login");
                        }}
                        className="bg-yellow-400 px-4 py-2 font-semibold rounded hover:bg-yellow-500"
                      >
                        Sign in
                      </button>
                      <div className="text-sm mt-1">
                        New customer?{" "}
                        <span
                          className="text-blue-500 hover:underline cursor-pointer"
                          onClick={() => {
                            setShowDropdown(false);
                            navigate("/signup");
                          }}
                        >
                          SignUp here.
                        </span>
                      </div>
                    </div>
                  ) : (
                    <>
                      <h4 className="text-lg font-semibold mb-2">Your Account</h4>
                      <ul className="space-y-2 text-sm">
                        <li>
                          <Link
                            to="/switch-account"
                            className="text-blue-600 hover:underline"
                            onClick={() => setShowDropdown(false)}
                          >
                            Switch Account
                          </Link>
                        </li>
                        <LogoutButton onClose={() => setShowDropdown(false)} />
                      </ul>
                      <hr className="my-3" />
                      <ul className="space-y-1 text-sm">
                        <li>
                          <Link
                            to="/account"
                            onClick={() => setShowDropdown(false)}
                            className="hover:underline"
                          >
                            Your Account
                          </Link>
                        </li>
                        <li>
                          <Link
                            to="/orders"
                            onClick={() => setShowDropdown(false)}
                            className="hover:underline"
                          >
                            Your Orders
                          </Link>
                        </li>
                        {user.role === "seller" && (
                          <li>
                            <Link
                              to="/my-products"
                              onClick={() => setShowDropdown(false)}
                              className="hover:underline"
                            >
                              Your Products
                            </Link>
                          </li>
                        )}
                        {user.role === "admin" && (
                          <li>
                            <Link
                              to="/admin"
                              onClick={() => setShowDropdown(false)}
                              className="hover:underline"
                            >
                              Admin Panel
                            </Link>
                          </li>
                        )}
                      </ul>
                    </>
                  )}
                </div>
              )}
            </div>

            <Link to="/orders" className="text-sm mr-4">
              <div>Returns</div>
              <div className="font-bold">& Orders</div>
            </Link>

            <Link to="/cart" className="relative mr-2">
              <FaShoppingCart className="text-3xl" />
              <span className="absolute -top-2 -right-2 bg-yellow-400 text-black text-xs font-bold px-1 rounded-full">
                {totalItems || ""}
              </span>
            </Link>
          </div>
        </div>

        {/* LOWER NAVBAR */}
        <div
          className={`bg-gray-800 text-white flex items-center px-4 py-2 text-sm transition-all duration-300 ${
            showLowerNav ? "opacity-100 max-h-[60px]" : "opacity-0 max-h-0 overflow-hidden"
          }`}
        >
          <button onClick={() => setSidebarOpen(true)} className="mr-4 flex-shrink-0">
            <FaBars className="text-lg" />
          </button>
          <div className="flex overflow-x-auto space-x-6 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-900">
            {!loading &&
              categories.map((cat) => (
                <Link
                  key={cat._id}
                  to={`/searchCategory/${cat._id}`}
                  className="whitespace-nowrap border rounded-sm border-transparent hover:border-white hover:pt-0.5 p-1"
                >
                  {cat.name}
                </Link>
              ))}
          </div>
          <SidebarMenu open={sidebarOpen} setOpen={setSidebarOpen} />
        </div>

        {/* MOBILE Address Section */}
        <div className="md:hidden bg-gray-100 border-t border-b px-4 py-2 text-sm flex items-center gap-2">
          <FaMapMarkerAlt className="text-gray-600" />
          <button
            onClick={() => setShowOverlay(true)}
            className="text-gray-800 font-medium hover:underline text-left"
          >
            Deliver to{" "}
            <span className="font-semibold">
              {defaultAddress
                ? `${defaultAddress.city} ${defaultAddress.pinCode}`
                : "Select Address"}
            </span>
          </button>
        </div>
      </div>

      {/* Overlay */}
      {showOverlay && <Overlay onClose={() => setShowOverlay(false)} />}
    </>
  );
};

export default Navbar;
