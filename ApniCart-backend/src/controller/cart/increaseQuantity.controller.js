const Cart = require("../../models/cart.models");
const Product = require("../../models/product.models");

const increaseQuantity = async (req, res) => {
  try {
    const userId = req.user?._id;
    const { productId } = req.params;

    if (!productId) {
      return res.status(400).json({ err: "Product ID is required!" });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ err: "Product not found!" });
    }

    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res.status(404).json({ err: "Cart not found!" });
    }

    const productIndex = cart.item.findIndex(
      (item) => item.product.toString() === productId
    );

    if (productIndex === -1) {
      return res.status(404).json({ err: "Product not found in cart!" });
    }

    const existingQty = cart.item[productIndex].quantity;
    const newQty = existingQty + 1;

    if (newQty > product.productQnt) {
      return res.status(400).json({
        err: `Only ${product.productQnt} items available in stock.`,
      });
    }

    cart.item[productIndex].quantity = newQty;
    await cart.save();

    // 🔁 Fetch and populate updated cart
    const updatedCart = await Cart.findOne({ user: userId }).populate("item.product");



    return res.status(200).json({
      msg: "Quantity increased successfully!",
      cart: updatedCart,

    });
  } catch (error) {
    return res.status(500).json({
      err: "Failed to increase quantity: " + error.message,
    });
  }
};

module.exports = increaseQuantity;
