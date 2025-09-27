const Cart = require("../../models/cart.models");

const removeSelectedItems = async (req, res) => {
  try {
    const userId = req.user?._id;

    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      return res.status(404).json({ msg: "Cart not found!" });
    }

    const initialLength = cart.item.length;

    // Remove only selected items
    cart.item = cart.item.filter(product => !product.isSelected);

    if (cart.item.length === initialLength) {
      return res.status(400).json({ msg: "No selected items found in cart." });
    }

    await cart.save();

    // Populate products in updated cart
    cart = await Cart.findOne({ user: userId }).populate("item.product");

    return res.status(200).json({
      msg: "Selected products removed from cart successfully!",
      cart,
    });
  } catch (error) {
    return res.status(500).json({
      msg: "Failed to remove selected products!",
      err: error.message,
    });
  }
};

module.exports = removeSelectedItems;
