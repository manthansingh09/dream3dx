import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import connectToDatabase from "@/lib/db";
import Order from "@/models/Order";
import { getUserFromCookie } from "@/lib/auth";
import { supabase } from "@/lib/supabaseServer";

const razorpay = new Razorpay({
  key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_placeholder",
  key_secret: process.env.RAZORPAY_KEY_SECRET || "placeholder_secret",
});

export async function POST(req: Request) {
  try {
    const user = getUserFromCookie();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { amount, fileUrl, volumeOrSize, customerName, phoneNumber, shippingAddress, orderType } = await req.json();

    await connectToDatabase();

    // Generate Reference ID
    const referenceId = `D3DX-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

    // Rename file in Supabase
    let finalFileUrl = fileUrl;
    try {
      const urlParts = fileUrl.split("/");
      const oldFileName = urlParts[urlParts.length - 1];
      const fileExt = oldFileName.split(".").pop();
      const dateStr = new Date().toISOString().split("T")[0];
      const cleanName = customerName.replace(/[^a-zA-Z0-9]/g, "");
      const cleanType = orderType.replace(/[^a-zA-Z0-9]/g, "");
      const newFileName = `${cleanName}_${dateStr}_${cleanType}.${fileExt}`;

      const { data, error: moveError } = await supabase.storage
        .from("dream3dx")
        .move(oldFileName, newFileName);

      if (!moveError) {
        const { data: { publicUrl } } = supabase.storage.from("dream3dx").getPublicUrl(newFileName);
        finalFileUrl = publicUrl;
      }
    } catch (moveErr) {
      console.error("File rename failed:", moveErr);
    }

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
      customerName,
      phoneNumber,
      shippingAddress,
      orderType,
      referenceId,
      fileUrl: finalFileUrl,
      volumeOrSize,
      amount,
      currency: "INR",
      paymentId: rzpOrder.id,
      status: "Pending",
      deliverySpeed,
      createdAt: new Date(),
    });

    return NextResponse.json({ success: true, orderId: order._id, rzpOrderId: rzpOrder.id, deliverySpeed });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to create order" }, { status: 500 });
  }
}
