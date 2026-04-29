import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import Order from "@/models/Order";
import ContactIdea from "@/models/ContactIdea";
import { getUserFromCookie } from "@/lib/auth";

export async function GET() {
  try {
    const user = getUserFromCookie();
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();
    
    const orders = await Order.find({}).sort({ createdAt: -1 });
    const contacts = await ContactIdea.find({}).sort({ createdAt: -1 });

    return NextResponse.json({ success: true, orders, contacts });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
