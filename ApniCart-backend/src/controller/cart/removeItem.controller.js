const Cart = require("../../models/cart.models");

const removeItem = async (req, res) => {
  try {
    const userId = req.user?._id;
    const { productId } = req.params;

    if (!productId) {
      return res.status(400).json({ err: "Product ID is required!" });
    }

    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res.status(404).json({ err: "Cart not found!" });
    }

    const initialLength = cart.item.length;

    cart.item = cart.item.filter(
      (product) => product.product.toString() !== productId.toString()
    );

    if (cart.item.length === initialLength) {
      return res.status(404).json({ err: "Product not found in cart!" });
    }

    await cart.save();

    // Repopulate the updated cart with product details
    cart = await Cart.findOne({ user: userId }).populate("item.product");

    return res.status(200).json({
      msg: "Product removed from cart successfully!",
      cart,
    });
  } catch (error) {
    return res.status(500).json({
      msg: "Failed to remove product from cart!",
      err: error.message,
    });
  }
};

module.exports = removeItem;
