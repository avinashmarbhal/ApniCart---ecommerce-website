import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useSelector, useDispatch } from "react-redux";
import {
  AiFillStar,
  AiOutlineStar,
  AiOutlineLike,
  AiOutlineDislike,
} from "react-icons/ai";
import { FaUserCircle } from "react-icons/fa";
import AddReviewOverlay from "./AddReviewOverlay";
import RelatedProductRows from "./RelatedProductRows";
import { setCartData } from "../features/cart/cartSlice";

const api = import.meta.env.VITE_API_URL;

const ViewProductComp = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch();
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [reviews, setReviews] = useState([]);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const defaultAddress = useSelector((state) => state.address.address);
  const userId = useSelector((state) => state.auth.user?._id);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [id]);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`${api}/product/getProductById/${id}`);
        setProduct(res.data.product);
      } catch {
        toast.error("❌ Failed to fetch product details.");
      }
    };

    const fetchReviews = async () => {
      try {
        const res = await axios.get(`${api}/review/getAllReviewsByProductId/${id}`);
        setReviews(res.data.reviews);
      } catch {
        toast.error("❌ Failed to load reviews");
      }
    };

    fetchProduct();
    fetchReviews();
  }, [id]);

  const updateReduxCart = (cart) => {
    dispatch(
      setCartData({
        cartItems: cart.item,
        totalItems: cart.totalItems,
        totalMrpPrice: cart.totalMrpPrice,
        totalDiscountedPrice: cart.totalDiscountedPrice,
      })
    );
  };

  const handleBuy = async () => {
    if(!userId)
    {
      navigate("/login")
    }
  }

  const handleAddToCart = async () => {

    if(!userId)
    {
      navigate("/login")
    }
    else
    {
         try {
      const res = await axios.post(
        `${api}/cart/addItem`,
        { productId: id, quantity: 1 },
        { withCredentials: true }
      );
      updateReduxCart(res.data.cart);
      toast.success("🛒 Product added to cart successfully");
    } catch {
      toast.error("❌ Failed to add product to cart");
    }
    }
  };

  const toggleLike = async (reviewId) => {
    try {
      const res = await axios.post(`${api}/review/likeReview/${reviewId}`, {}, { withCredentials: true });
      updateReviewState(reviewId, res.data);
    } catch {
      toast.error("❌ Failed to like review");
    }
  };

  const toggleDislike = async (reviewId) => {
    try {
      const res = await axios.post(`${api}/review/dislikeReview/${reviewId}`, {}, { withCredentials: true });
      updateReviewState(reviewId, res.data);
    } catch {
      toast.error("❌ Failed to dislike review");
    }
  };

  const updateReviewState = (id, data) => {
    setReviews((prev) =>
      prev.map((rev) =>
        rev._id === id
          ? {
              ...rev,
              likeCount: data.likeCount,
              dislikeCount: data.dislikeCount,
              likes: data.liked ? [...rev.likes, userId] : rev.likes.filter((u) => u !== userId),
              dislikes: data.disliked ? [...rev.dislikes, userId] : rev.dislikes.filter((u) => u !== userId),
            }
          : rev
      )
    );
  };

  const getDeliveryDate = () => {
    const now = new Date();
    now.setDate(now.getDate() + 5);
    return now.toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" });
  };

  if (!product) return <div className="p-6">Loading product...</div>;

  const {
    productImage,
    productName,
    productDescrip,
    productMrp,
    discountedPrice,
    productDiscount,
    productRating = 4,
    productReviewCount = 1,
  } = product;

  return (
    <div className="px-4 py-6 sm:px-6 md:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex justify-center p-3 mt-7">
          <img src={productImage.url} alt={productName} className="w-full max-w-xs sm:max-w-sm md:max-w-md rounded-lg" />
        </div>

        <div className="space-y-4">
          <h1 className="text-2xl font-bold">{productName}</h1>

          <div className="flex items-center gap-1 text-yellow-500">
            {Array.from({ length: 5 }).map((_, i) => i < productRating ? <AiFillStar key={i} /> : <AiOutlineStar key={i} />)}
            <span className="text-gray-600 ml-2">({productReviewCount} ratings)</span>
          </div>

          <p className="text-gray-700">{productDescrip}</p>

          {defaultAddress && (
            <p className="text-sm text-gray-600">
              Deliver to: <b>{defaultAddress.city}</b> - {defaultAddress.pinCode}
            </p>
          )}

          <div className="text-2xl font-semibold text-red-600">
            ₹{discountedPrice.toLocaleString()}{" "}
            <span className="line-through text-gray-500 text-base ml-2">
              ₹{productMrp.toLocaleString()}
            </span>
            <span className="text-green-600 text-lg ml-2">-{productDiscount}%</span>
          </div>

          <p className="text-green-600">In stock</p>
          <p className="text-sm">Free Delivery: {getDeliveryDate()}</p>

          <div>
            <label className="block font-medium">Quantity</label>
            <select
              className="border px-2 py-1 rounded w-24"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
            >
              {[1, 2, 3, 4, 5].map((q) => (
                <option key={q} value={q}>{q}</option>
              ))}
            </select>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <button onClick={handleAddToCart} className="bg-yellow-400 hover:bg-yellow-500 px-6 py-2 rounded font-semibold">
              Add to Cart
            </button>
            <button onClick={handleBuy} className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded font-semibold">
              Buy Now
            </button>
          </div>

          <div className="mt-6">
            <button onClick={() => setShowReviewModal(true)} className="border px-4 py-2 rounded font-semibold hover:bg-gray-100">
              + Add Review
            </button>
          </div>
        </div>
      </div>

      <div className="mt-10 max-w-4xl mx-auto px-2">
        <h3 className="text-xl font-semibold mb-4">Product Reviews</h3>
        {reviews.length === 0 ? (
          <p className="text-gray-600">No reviews yet.</p>
        ) : (
          reviews.map((r) => (
            <div key={r._id} className="border rounded p-4 mb-4">
              <div className="flex items-center gap-2 mb-2">
                <FaUserCircle className="text-2xl text-gray-600" />
                <span className="font-medium text-gray-800">User</span>
              </div>
              <div className="flex gap-1 mb-1 text-yellow-500">
                {Array.from({ length: 5 }).map((_, i) => i < r.rating ? <AiFillStar key={i} /> : <AiOutlineStar key={i} />)}
              </div>
              <p className="text-gray-800">{r.comment}</p>
              <div className="flex gap-4 mt-2 text-sm">
                <button onClick={() => toggleLike(r._id)} className={`flex items-center gap-1 ${r.likes.includes(userId) ? "text-blue-600" : "text-gray-600"}`}>
                  <AiOutlineLike /> {r.likeCount}
                </button>
                <button onClick={() => toggleDislike(r._id)} className={`flex items-center gap-1 ${r.dislikes.includes(userId) ? "text-red-600" : "text-gray-600"}`}>
                  <AiOutlineDislike /> {r.dislikeCount}
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {showReviewModal && (
        <AddReviewOverlay
          productId={id}
          onClose={() => setShowReviewModal(false)}
          onReviewAdded={() =>
            axios
              .get(`${api}/review/getAllReviewsByProductId/${id}`)
              .then((res) => setReviews(res.data.reviews))
              .catch(() => toast.error("❌ Failed to load reviews"))
          }
        />
      )}

      <RelatedProductRows
        currentProductId={product._id}
        currentCategoryId={product.productCategory}
      />
    </div>
  );
};

export default ViewProductComp;