const Order = require("../../models/order.models");

const getAllOrders = async (req, res) => {
  try {
    const userId = req.user?._id;
    if (!userId) {
      return res.status(401).json({ msg: "Unauthorized: User not found" });
    }

    const orders = await Order.find({ user: userId })
      .populate("items.product")
      .sort({ createdAt: -1 }); // Newest first

    return res.status(200).json({
      msg: "Orders fetched successfully!",
      orders,
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return res.status(500).json({
      msg: "Failed to fetch orders",
      error: error.message,
    });
  }
};

module.exports = getAllOrders;
