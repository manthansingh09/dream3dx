import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import Order from "@/models/Order";
import { getUserFromCookie } from "@/lib/auth";

export async function GET() {
  try {
    const user = getUserFromCookie();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();
    const orders = await Order.find({ userEmail: user.email }).sort({ createdAt: -1 });

    return NextResponse.json({ success: true, orders });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
