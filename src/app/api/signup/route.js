import { createUser, findUserByEmail, updateUser } from "@/app/lib/models/user";
import sendOTP from "@/app/lib/email";
import { hash } from "bcryptjs";

// Generate 6-digit OTP
function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(req) {
  try {
    const { email, password } = await req.json();

    // Check if user already exists
    const existingUser = await findUserByEmail(email);

    const otp = generateOtp();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 mins from now

    if (existingUser) {
      if (existingUser.isVerified) {
        return Response.json({ error: "User already exists" }, { status: 400 });
      }

      // If user exists but not verified → update OTP and expiry
      await updateUser(email, { otp, otpExpiry });

      await sendOTP(email, otp);
      return Response.json({ message: "OTP resent to your email." });
    }

    // Hash password
    const hashedPassword = await hash(password, 10);

    // Create user
    await createUser({
      email,
      password: hashedPassword,
      otp,
      otpExpiry,
    });

    await sendOTP(email, otp);

    return Response.json({ message: "OTP sent to email. Verify to continue." });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}