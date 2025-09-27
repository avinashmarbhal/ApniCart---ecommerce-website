const Cart = require("../../models/cart.models");

const getCart = async (req, res) => {
  try {
    const userId = req.user?._id;

    const cart = await Cart.findOne({ user: userId }).populate("item.product");

    if (!cart || cart.item.length === 0) {
      return res.status(200).json({
        message: "Cart is empty",
        cart: [],
      });
    }

    return res.status(200).json({
      message: "Cart fetched successfully",
      cart,
    });
  } catch (error) {
    return res.status(500).json({
      err: "Failed to fetch cart",
      details: error.message,
    });
  }
};

module.exports = getCart;
