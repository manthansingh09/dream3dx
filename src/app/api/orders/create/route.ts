import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import connectToDatabase from "@/lib/db";
import Order from "@/models/Order";
import { getUserFromCookie } from "@/lib/auth";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || "rzp_test_placeholder",
  key_secret: process.env.RAZORPAY_KEY_SECRET || "placeholder_secret",
});

export async function POST(req: Request) {
  try {
    const user = getUserFromCookie();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { amount, fileUrl, volumeOrSize } = await req.json();

    await connectToDatabase();

    // Check same day delivery limit (5 per day)
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const ordersToday = await Order.countDocuments({
      createdAt: { $gte: startOfDay }
    });

    const deliverySpeed = ordersToday < 5 ? "Same Day" : "Next Day";

    // Create Razorpay Order
    const rzpOrder = await razorpay.orders.create({
      amount: amount * 100, // paise
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    });

    // Save initial pending order
    const order = await Order.create({
      userEmail: user.email,
      fileUrl,
      volumeOrSize,
      amount,
      currency: "INR",
      paymentId: rzpOrder.id,
      status: "Pending",
      deliverySpeed,
    });

    return NextResponse.json({ success: true, orderId: order._id, rzpOrderId: rzpOrder.id, deliverySpeed });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to create order" }, { status: 500 });
  }
}
