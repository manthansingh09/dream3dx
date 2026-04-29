import { NextResponse } from "next/server";
import crypto from "crypto";
import connectToDatabase from "@/lib/db";
import Order from "@/models/Order";

export async function POST(req: Request) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, dbOrderId } = await req.json();

    const secret = process.env.RAZORPAY_KEY_SECRET || "placeholder_secret";
    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(body.toString())
      .digest("hex");

    const isAuthentic = expectedSignature === razorpay_signature;

    if (isAuthentic) {
      await connectToDatabase();
      await Order.findByIdAndUpdate(dbOrderId, {
        status: "Paid",
      });
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
