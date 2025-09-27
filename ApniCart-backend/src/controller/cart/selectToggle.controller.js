const Cart = require("../../models/cart.models");

const selectToggle = async (req, res) => {
  try {
    const userId = req.user?._id;
    const { productId } = req.params;

    if (!productId) {
      return res.status(400).json({ err: "Product ID is required in URL!" });
    }

    const cart = await Cart.findOne({ user: userId });

    if (!cart) {
      return res.status(404).json({ msg: "Cart not found!" });
    }

    const cartItem = cart.item.find(
      (i) => i.product.toString() === productId.toString()
    );

    if (!cartItem) {
      return res.status(404).json({ msg: "Product not found in cart!" });
    }

    // Toggle selection
    cartItem.isSelected = !cartItem.isSelected;

    await cart.save();

    // Optionally populate product details
    const updatedCart = await Cart.findOne({ user: userId }).populate("item.product");

    return res.status(200).json({
      msg: `Product ${cartItem.isSelected ? "selected" : "deselected"} successfully!`,
      cart: updatedCart,
    });
  } catch (error) {
    return res.status(500).json({
      msg: "Failed to toggle selection!",
      err: error.message,
    });
  }
};

module.exports = selectToggle;
