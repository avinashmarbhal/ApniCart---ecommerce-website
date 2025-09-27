import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Lottie from "lottie-react";

import Home from "./pages/Home";
import Account from "./pages/Account";
import Orders from "./pages/Orders";
import Cart from "./pages/Cart";
import SearchCategory from "./pages/SearchCategory";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import VerifyOtp from "./pages/VerifyOtp";
import ViewProduct from "./pages/ViewProduct";
import NotFound from "./pages/NotFound";
import SwitchAccount from "./pages/SwitchAccount";
import AddProduct from "./pages/AddProduct";
import ManageProducts from "./pages/ManageProducts";
import SearchProducts from "./pages/SearchProducts";
import UpdateProduct from "./pages/UpdateProduct";
import AccountDetails from "./pages/AccountDetails";
import AddAddress from "./pages/AddAddress";
import ModifyAddress from "./pages/ModifyAddress";
import Checkout from "./pages/Checkout";
import BecomeSeller from "./pages/BecomeSeller";
import SellerRequests from "./pages/SellerRequests";
import AddCategory from "./pages/AddCategory";
import RemoveCategory from "./pages/RemoveCategory";
import AddSubcategory from "./pages/AddSubcategory";
import RemoveSubcategory from "./pages/RemoveSubcategory";
import ForgotPassword from "./pages/ForgotPassword";
import useAppInit from "./hooks/useAppInit";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";
import loadingDots from "./assets/loadingDots.json";

function App() {
  const isReady = useAppInit();

  if (!isReady) {
    return (
      <div className="min-h-screen flex items-center justify-center text-lg font-semibold">
        <Lottie
          animationData={loadingDots}
          loop
          style={{ height: 300, width: 300 }}
        />
      </div>
    );
  }

  return (
    <>
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            padding: "14px 20px",
            fontSize: "18px",
            borderRadius: "8px",
            background: "#232f3e",
            color: "#fff",
            borderLeft: "6px solid #febd69",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
          },
          success: {
            iconTheme: {
              primary: "#febd69",
              secondary: "#232f3e",
            },
          },
          error: {
            iconTheme: {
              primary: "#ff4d4f",
              secondary: "#232f3e",
            },
          },
        }}
      />

      <BrowserRouter>
        <Routes>
          {/* Public */}
          <Route path="/" element={<Home />} />
          <Route path="/viewproduct/:id" element={<ViewProduct />} />
          <Route path="/searchCategory/:id" element={<SearchCategory />} />
          <Route path="/s-products" element={<SearchProducts />} />

          {/* Guest-only */}
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />
          <Route
            path="/signup"
            element={
              <PublicRoute>
                <SignUp />
              </PublicRoute>
            }
          />
          <Route
            path="/verifyOtp"
            element={
                <VerifyOtp />
            }
          />
          <Route
            path="/forgot-password"
            element={
              <PublicRoute>
                <ForgotPassword />
              </PublicRoute>
            }
          />

          {/* Verified User + Seller + Admin */}
          <Route element={<ProtectedRoute allowedRoles={["verifyUser", "seller", "admin"]} />}>
            <Route path="/account" element={<Account />} />
            <Route path="/account-details" element={<AccountDetails />} />
            <Route path="/add-address" element={<AddAddress />} />
            <Route path="/modify-address" element={<ModifyAddress />} />
          </Route>

          {/* Verified Users Only */}
          <Route element={<ProtectedRoute allowedRoles={["verifyUser"]} />}>
            <Route path="/orders" element={<Orders />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/become-seller" element={<BecomeSeller />} />
          </Route>

          {/* Seller Only */}
          <Route element={<ProtectedRoute allowedRoles={["seller"]} />}>
            <Route path="/add-product" element={<AddProduct />} />
            <Route path="/manage-product" element={<ManageProducts />} />
            <Route path="/update-product" element={<UpdateProduct />} />
          </Route>

          {/* Admin Only */}
          <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
            <Route path="/admin/seller-requests" element={<SellerRequests />} />
            <Route path="/admin/add-category" element={<AddCategory />} />
            <Route path="/admin/add-subcategory" element={<AddSubcategory />} />
            <Route path="/admin/manage-category" element={<RemoveCategory />} />
            <Route path="/admin/manage-subcategory" element={<RemoveSubcategory />} />
          </Route>

          {/* Not Found */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
