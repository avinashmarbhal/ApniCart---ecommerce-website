const Order = require("../../models/order.models");

const placeOrder = async (req, res) => {
  try {
    const userId = req.user?._id;
    if (!userId) {
      return res.status(401).json({ msg: "Unauthorized: User not found" });
    }

    const {
      items,
      shippingAddress,
      paymentMethod,
      paymentStatus = "paid", 
      totalMrp,
      totalDiscounted,
      finalAmount,
    } = req.body;

    
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ msg: "Order items are required" });
    }

    if (!shippingAddress || typeof shippingAddress !== "object") {
      return res.status(400).json({ msg: "Shipping address is required" });
    }

    if (!paymentMethod) {
      return res.status(400).json({ msg: "Payment method is required" });
    }

    if (
      totalMrp === undefined ||
      totalDiscounted === undefined ||
      finalAmount === undefined
    ) {
      return res.status(400).json({ msg: "Order price details are required" });
    }

    // Create new order instance
    const newOrder = new Order({
      user: userId,
      items,
      shippingAddress,
      paymentMethod,
      paymentStatus,
      totalMrp,
      totalDiscounted,
      finalAmount,
    });

    
    const savedOrder = await newOrder.save();

    return res.status(201).json({
      msg: "Order placed successfully!",
      order: savedOrder,
    });
  } catch (error) {
    return res.status(500).json({
      msg: "Failed to place order",
      error: error.message,
    });
  }
};

module.exports = placeOrder;
