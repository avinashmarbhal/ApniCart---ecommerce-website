const Cart = require("../../models/cart.models");

const getSelectedCartItems = async (req, res) => {
  try {
    const userId = req.user._id;

    const cart = await Cart.findOne({ user: userId }).populate("item.product");

    if (!cart) {
      return res.status(404).json({ msg: "Cart not found!" });
    }

    const selectedItems = cart.item.filter(item => item.isSelected);

    // Compute totals using correct field names
    let totalItems = 0;
    let totalMrpPrice = 0;
    let totalDiscountedPrice = 0;

    selectedItems.forEach(item => {
      const product = item.product;
      const qty = item.quantity;

      totalItems += qty;
      totalMrpPrice += product.productMrp * qty;
      totalDiscountedPrice += product.discountedPrice * qty;
    });

    return res.status(200).json({
      msg: "Selected cart items fetched successfully!",
      selectedItems,
      totalItems,
      totalMrpPrice,
      totalDiscountedPrice,
    });
  } catch (error) {
    return res.status(500).json({
      msg: "Failed to fetch selected items!",
      err: error.message,
    });
  }
};

module.exports = getSelectedCartItems;
