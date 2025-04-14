import { findUserByEmail, updateUser } from "@/app/lib/models/user";
import sendOTP from "@/app/lib/email";

export async function POST(req) {
  try {
    const { email } = await req.json();

    const user = await findUserByEmail(email);
    if (!user) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    const otp = Math.floor(100000 + Math.random() * 900000);
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

    await updateUser(email, { otp, otpExpiry });
    await sendOTP(email, otp);

    return Response.json({ message: "OTP resent successfully" });
  } catch (error) {
    console.error("Error resending OTP:", error);
    return Response.json({ error: "Failed to resend OTP" }, { status: 500 });
  }
}