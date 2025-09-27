const Cart = require("../../models/cart.models");
const Product = require("../../models/product.models");

const decreaseQuantity = async (req, res) => {
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
      return res.status(404).json({ err: "Product not in cart!" });
    }

    const existingQty = cart.item[productIndex].quantity;

    if (existingQty <= 1) {
      cart.item.splice(productIndex, 1);
    } else {
      cart.item[productIndex].quantity = existingQty - 1;
    }

    await cart.save();

    // Populate and return updated cart
    const updatedCart = await Cart.findOne({ user: userId }).populate("item.product");

    return res.status(200).json({
      msg:
        existingQty <= 1
          ? "Product removed from cart."
          : "Product quantity decreased.",
      cart: updatedCart,
    });
  } catch (error) {
    return res.status(500).json({
      err: "Error while decreasing quantity: " + error.message,
    });
  }
};

module.exports = decreaseQuantity;
