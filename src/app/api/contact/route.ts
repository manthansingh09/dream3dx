import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import ContactIdea from "@/models/ContactIdea";

export async function POST(req: Request) {
  try {
    const { name, email, type, message } = await req.json();

    if (!name || !email || !type || !message) {
        return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    await connectToDatabase();
    await ContactIdea.create({ name, email, type, message });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
