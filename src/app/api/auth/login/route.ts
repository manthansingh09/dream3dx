import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { signToken } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    const adminEmail = process.env.ADMIN_EMAIL || "admin@dream3dx.com";
    const adminPassword = process.env.ADMIN_PASSWORD || "admin123";

    if (email === adminEmail && password === adminPassword) {
      const token = signToken({ id: "admin", email, role: "admin" });
      const response = NextResponse.json({ success: true, user: { email, role: "admin" } });
      response.cookies.set("token", token, { httpOnly: true, path: "/", maxAge: 86400 });
      return response;
    }

    await connectToDatabase();
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const token = signToken({ id: user._id, email: user.email, role: user.role });
    const response = NextResponse.json({ success: true, user: { name: user.name, email: user.email, role: user.role } });
    
    response.cookies.set("token", token, { httpOnly: true, path: "/", maxAge: 86400 });
    return response;
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Something went wrong" }, { status: 500 });
  }
}
