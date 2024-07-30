import { Event } from "../models/event.model.js";
import { Product } from "../models/product.model.js";
import {
  sendEmailToAdminsAndOwners,
  sendEmailToUser,
} from "./email.service.js";

export const updateOrderShippedStatus = async (status, order, res) => {
  try {
    if (order.orderStatus !== "Confirmed") {
      return res.status(500).json({ message: "Cannot skip status steps" });
    }

    // UPDATE ORDER STATUS
    order.orderStatus = status;
    await order.save();

    res.status(200).json({ message: "Order status updated successfully" });

    // SEND EMAIL TO USER
    const { userInfo: user, orderNumber } = order;
    const userData = { user, orderNumber };

    await sendEmailToUser("Order Shipped", userData);
  } catch (error) {
    console.error(
      "Order Service Error (updateOrderShippedStatus):",
      error.message,
    );
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateOrderDeliveredStatus = async (status, order, res) => {
  try {
    if (order.orderStatus !== "Shipped") {
      return res.status(500).json({ message: "Cannot skip status steps" });
    }

    // UPDATE ORDER
    order.orderStatus = status;

    order.deliveredAt = Date.now();

    if (order.paymentMethod.status !== "paid") {
      order.paymentMethod.status = "paid";
    }

    await order.save();

    res.status(200).json({ message: "Order status updated successfully" });
  } catch (error) {
    console.error(
      "Order Service Error (updateOrderDeliveredStatus):",
      error.message,
    );
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateOrderCancelledStatus = async (status, order, res) => {
  if (order.orderStatus !== "Confirmed" && order.orderStatus !== "Shipped") {
    return res.status(500).json({ message: "Cannot cancel after delivering" });
  }

  // CHANGE PRODUCTS QUNATITY
  await Promise.all(
    order.orderItems.map(async (product) => {
      const updatedProduct = await Product.findById(product.id);
      updatedProduct.info.map((item) => {
        if (item.size === product.size) {
          item.quantity = item.quantity + product.quantity;
        }
      });
      await updatedProduct.save();
    }),
  );

  // CHANGE ORDER STATUS
  order.orderStatus = status;
  await order.save();

  res.status(200).json({ message: "Order status updated successfully" });

  // SEND EMAIL TO ADMINS & OWNERS
  const { userInfo: user, orderNumber } = order;
  const Admindata = { user, orderNumber };
  await sendEmailToAdminsAndOwners("Order Canceled", Admindata);

  // SEND EMAIL TO USER
  const userData = { user, orderNumber };
  await sendEmailToUser("Order Canceled", userData);
};
