// File: src/app/api/reset-password/route.js
import { NextResponse } from "next/server";
import { findUserByEmail, updateUser } from "@/app/lib/models/user";
import bcrypt from "bcryptjs";

export async function POST(req) {
  try {
    const { email, otp, newPassword } = await req.json();

    // Find the user by email
    const user = await findUserByEmail(email);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check if OTP exists and is not expired
    if (!user.otp || !user.otpExpiry || new Date() > new Date(user.otpExpiry)) {
      return NextResponse.json({ error: "OTP expired. Please request a new one." }, { status: 400 });
    }

    // Verify OTP
    if (String(user.otp) !== String(otp)) {
      return NextResponse.json({ error: "Invalid OTP" }, { status: 400 });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password and clear OTP fields
    await updateUser(email, { password: hashedPassword, otp: null, otpExpiry: null });

    return NextResponse.json({ message: "Password reset successfully" });
  } catch (error) {
    console.error("Error in reset-password:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}