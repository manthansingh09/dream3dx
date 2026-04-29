import { NextResponse } from "next/server";
import { OAuth2Client } from "google-auth-library";
import connectToDatabase from "@/lib/db";
import User from "@/models/User";
import { signToken } from "@/lib/auth";

// Server side uses generic client to decode because the frontend handles the oauth flow
const client = new OAuth2Client(process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID);

export async function POST(req: Request) {
  try {
    const { credential } = await req.json();

    if (!credential) {
      return NextResponse.json({ error: "Missing credential" }, { status: 400 });
    }

    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload || !payload.email) {
      return NextResponse.json({ error: "Invalid Google Token" }, { status: 400 });
    }

    await connectToDatabase();

    // Check if user exists
    let user = await User.findOne({ email: payload.email });

    // If not, create them based on the Google Profile
    if (!user) {
      user = await User.create({
        name: payload.name || "Google User",
        email: payload.email,
        password: "", // No password for OAuth users
      });
    }

    const token = signToken({ id: user._id, email: user.email, role: user.role });
    const response = NextResponse.json({ success: true, user: { name: user.name, email: user.email, role: user.role } });
    
    response.cookies.set("token", token, { httpOnly: true, path: "/", maxAge: 86400 });
    return response;
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Something went wrong" }, { status: 500 });
  }
}
