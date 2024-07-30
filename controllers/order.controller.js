import { Event } from "../models/event.model.js";
import { Order } from "../models/order.model.js";
import { Product } from "../models/product.model.js";
import {
  sendEmailToAdminsAndOwners,
  sendEmailToUser,
} from "../services/email.service.js";
import {
  updateOrderDeliveredStatus,
  updateOrderCancelledStatus,
  updateOrderShippedStatus,
} from "../services/order.service.js";

// CREATE ORDER
export const createOrder = async (req, res) => {
  try {
    const { userInfo: user } = req.body;
    const { products } = req;

    const order = await Order.create(req.body);

    await Promise.all(products.map((product) => product.save()));

    res.status(201).json({ message: "Order created successfully" });

    // SEND EMAIL TO ADMINS & OWNERS
    const Admindata = { user, orderNumber: order.orderNumber };

    await sendEmailToAdminsAndOwners("Order Created", Admindata);

    // SEND EMAIL TO USER
    const userData = { user, orderNumber: order.orderNumber };

    await sendEmailToUser("Order Confirmed", userData);

    // ADD USER TO ENTER EVENT DRAW
    const event = await Event.findOne({ eventStatus: "Live" });
    if (event) {
      event.usersList.push(user);
      await event.save();
    }
  } catch (error) {
    console.log("order controller error (createOrder) :", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// UPDATE ORDER STATUS -- ONLY FOR OWNER & ADMINS
export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["Shipped", "Delivered", "Canceled"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (status === "Shipped") {
      await updateOrderShippedStatus(status, order, res);
    }

    // DELIVERED STATUS
    if (status === "Delivered") {
      await updateOrderDeliveredStatus(status, order, res);
    }

    // CANCELED STATUS
    if (status === "Canceled") {
      await updateOrderCancelledStatus(status, order, res);
    }
  } catch (error) {
    console.log("order controller error (updateOrderStatus) :", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// DELETE ORDER -- ONLY FOR OWNER & ADMINS
export const deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findByIdAndDelete(id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json({ message: "Order deleted successfully" });
  } catch (error) {
    console.log("order controller error (deleteOrder) :", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// GET ALL ORDERS -- ONLY FOR OWNER & ADMINS
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (error) {
    console.log("order controller error (getAllOrders) :", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// GET ORDER BY ID -- ONLY FOR OWNER & ADMINS
export const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Extract IDs from order items
    const productIds = order.orderItems.map((item) => item.id);

    // Fetch products from the database based on the IDs
    const products = await Product.find({ _id: { $in: productIds } });

    // Map the order items to include the entire product object
    order.orderItems = order.orderItems.map((item) => {
      const product = products.find((prod) => prod._id.toString() === item.id);
      return { product, size: item.size, quantity: item.quantity };
    });

    res.status(200).json(order);
  } catch (error) {
    console.log("order controller error (getOrderById) :", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
