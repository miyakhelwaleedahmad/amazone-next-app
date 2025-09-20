// W:\Amazone-clone2\my-app\src\pages\api\checkout.ts
import type { NextApiRequest, NextApiResponse } from "next";
import connectToDatabase from "@/lib/mongodb";
import Order from "@/models/Order";
import Customer from "@/models/customers";
import Coupon from "@/models/Coupons";

interface CartItem {
  productId: string;
  quantity: number;
  price: number;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectToDatabase();

  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { customerId, items, couponCode, shippingAddress } = req.body;

    if (!customerId || !items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "Invalid checkout data" });
    }

    // ✅ Fetch customer
    const customer = await Customer.findById(customerId);
    if (!customer) return res.status(404).json({ message: "Customer not found" });

    // ✅ Calculate total
    let subtotal = 0;
    items.forEach((item: CartItem) => {
      subtotal += item.price * item.quantity;
    });

    let discount = 0;
    let appliedCoupon = null;

    // ✅ Apply coupon if provided
    if (couponCode) {
      const coupon = await Coupon.findOne({ code: couponCode, active: true });
      if (coupon) {
        appliedCoupon = coupon;
        if (coupon.discountType === "percentage") {
          discount = (subtotal * coupon.discountValue) / 100;
        } else {
          discount = coupon.discountValue;
        }
      }
    }

    const total = subtotal - discount;

    // ✅ Create order
    const order = new Order({
      customer: customerId,
      items,
      subtotal,
      discount,
      total,
      coupon: appliedCoupon?._id || null,
      shippingAddress,
      status: "pending",
    });

    await order.save();

    // ✅ Add order to customer
    customer.orders.push(order._id);
    await customer.save();

    return res.status(201).json({ message: "Order created successfully", order });
  } catch (err) {
    console.error("Checkout error:", err);
    return res.status(500).json({ message: "Error during checkout" });
  }
}
