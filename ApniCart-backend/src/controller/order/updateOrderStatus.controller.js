const Order = require("../../models/order.models");

const updateOrderStatus = async (req, res) => {
  try {
    
    const userId = req.user?._id;
    const { orderId, status } = req.body;

    if (!orderId || !status) {
      return res.status(400).json({ msg: "orderId and status are required" });
    }

    const validStatuses = ["placed","out for delivery", "shipped", "delivered", "cancelled"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ msg: "Invalid order status" });
    }

    const order = await Order.findOne({ _id: orderId });
    if (!order) {
      return res.status(404).json({ msg: "Order not found" });
    }

    if (order.orderStatus === "cancelled") {
      return res.status(400).json({ msg: "Order is already cancelled and cannot be updated." });
    }

    order.orderStatus = status;
    order.isCancelled = status === "cancelled";
    order.isDelivered = status === "delivered";

    await order.save();

    return res.status(200).json({
      msg: `Order status updated to '${status}' successfully`,
      order,
    });
  } catch (error) {
    return res.status(500).json({ msg: "Failed to update order status", err: error.message });
  }
};

module.exports = updateOrderStatus;
