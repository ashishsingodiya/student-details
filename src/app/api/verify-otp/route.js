import { NextResponse } from "next/server";
import { findUserByEmail, updateUser } from "@/app/lib/models/user";

export async function POST(req) {
  try {
    const { email, otp } = await req.json();

    console.log("Received Email:", email);
    console.log("Received OTP:", otp);

    // Find user by email
    const user = await findUserByEmail(email);
    if (!user) {
      console.log("User not found");
      return NextResponse.json({ error: "User not found" }, { status: 400 });
    }

    console.log("Stored OTP:", user.otp);
    console.log("Stored OTP Expiry:", user.otpExpiry);
    console.log("Current Time:", new Date().toISOString());

    // Check if OTP exists and is not expired
    if (!user.otp || !user.otpExpiry || new Date() > new Date(user.otpExpiry)) {
      console.log("OTP expired or missing");
      return NextResponse.json({ error: "OTP expired. Please request a new one." }, { status: 400 });
    }

    // Check if OTP matches (convert both to strings for safety)
    if (String(user.otp) !== String(otp)) {
      console.log("OTP mismatch");
      return NextResponse.json({ error: "Invalid OTP" }, { status: 400 });
    }

    // Mark user as verified and clear OTP fields
    await updateUser(email, { isVerified: true, otp: null, otpExpiry: null });
    console.log("User verified successfully");

    return NextResponse.json({ message: "Email verified successfully" });
  } catch (error) {
    console.error("Error in OTP verification:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
