const Order = require("../../models/order.models");

const cancelOrder = async (req, res) => {
  try {
    const userId = req.user?._id;
    const { orderId } = req.body;

    if (!orderId) {
      return res.status(400).json({ msg: "OrderId is required" });
    }

    const order = await Order.findOne({ _id: orderId, user: userId });

    if (!order) {
      return res.status(404).json({ msg: "Order not found" });
    }

    if (order.orderStatus === "cancelled") {
      return res.status(400).json({ msg: "Order is already cancelled" });
    }

    
    order.orderStatus = "cancelled";
    order.isCancelled = true;
    order.isDelivered = false; 

    await order.save();

    return res.status(200).json({
      msg: "Order cancelled successfully",
      order,
    });
  } catch (error) {
    return res.status(500).json({ msg: "Failed to cancel order", err: error.message });
  }
};

module.exports = cancelOrder;
