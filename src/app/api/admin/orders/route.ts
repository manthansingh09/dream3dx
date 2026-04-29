import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import Order from "@/models/Order";
import { getUserFromCookie } from "@/lib/auth";

export async function PUT(req: Request) {
  try {
    const user = getUserFromCookie();
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { orderId, status } = await req.json();

    await connectToDatabase();
    const updatedOrder = await Order.findByIdAndUpdate(orderId, { status }, { new: true });

    return NextResponse.json({ success: true, order: updatedOrder });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
