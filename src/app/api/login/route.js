import { findUserByEmail } from "@/app/lib/models/user";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET || "your-secret-key"; // Use a secure secret in .env file

export async function POST(req) {
  try {
    const { email, password } = await req.json();

    // Find user by email
    const user = await findUserByEmail(email);
    if (!user) return Response.json({ error: "User not found" }, { status: 400 });

    // Check if the user is verified
    if (!user.isVerified) return Response.json({ error: "Email not verified" }, { status: 400 });
    
    // Check if the user is verified
    if (!user.isProfileDone) return Response.json({ error: "Profile not completed", step: "profile" }, { status: 400 });

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return Response.json({ error: "Invalid credentials" }, { status: 400 });

    // Generate JWT Token
    const token = jwt.sign({ id: user._id, email: user.email }, SECRET_KEY, { expiresIn: "1h" });

    return Response.json({ message: "Login successful", token });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}