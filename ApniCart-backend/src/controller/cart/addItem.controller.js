const Cart = require("../../models/cart.models");
const Product = require("../../models/product.models");

const addItem = async (req, res) => {
  try {
    const userId = req.user?._id;
    let { productId, quantity } = req.body;

    if (!productId || !quantity) {
      return res.status(400).json({ err: "Product ID and quantity are required!" });
    }

    quantity = Number(quantity);

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ err: "Product not found!" });
    }

    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      if (quantity > product.productQnt) {
        return res.status(400).json({
          msg: `Only ${product.productQnt} items available in stock.`,
        });
      }

      cart = new Cart({
        user: userId,
        item: [
          {
            product: productId,
            quantity,
            isSelected: true,
          },
        ],
      });
    } else {
      const productIndex = cart.item.findIndex(
        (i) => i.product.toString() === productId
      );

      if (productIndex > -1) {
        const existingQty = cart.item[productIndex].quantity;
        const totalQty = existingQty + quantity;

        if (totalQty > product.productQnt) {
          return res.status(400).json({
            msg: `Cannot add ${quantity} more items. Only ${product.productQnt - existingQty} left in stock.`,
          });
        }

        cart.item[productIndex].quantity = totalQty;
      } else {
        if (quantity > product.productQnt) {
          return res.status(400).json({
            msg: `Only ${product.productQnt} items available in stock.`,
          });
        }

        cart.item.push({
          product: productId,
          quantity,
          isSelected: true,
        });
      }
    }

    await cart.save();

    const updatedCart = await Cart.findOne({ user: userId }).populate("item.product");

    return res.status(200).json({
      msg: "Product added to cart successfully",
      cart: updatedCart,
    });
  } catch (error) {
    return res.status(500).json({
      msg: "Failed to add product to cart!",
      err: error.message,
    });
  }
};

module.exports = addItem;
