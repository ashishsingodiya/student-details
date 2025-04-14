// File: src/app/api/request-reset/route.js
import { NextResponse } from "next/server";
import { findUserByEmail, updateUser } from "@/app/lib/models/user";
import sendOTP from "@/app/lib/email";

export async function POST(req) {
  try {
    const { email } = await req.json();

    // Find the user by email
    const user = await findUserByEmail(email);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Generate new OTP and set expiry for 10 minutes
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

    // Update user's OTP fields
    await updateUser(email, { otp, otpExpiry });

    // Send OTP via email
    await sendOTP(email, otp);

    return NextResponse.json({ message: "OTP sent for password reset" });
  } catch (error) {
    console.error("Error in request-reset:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}