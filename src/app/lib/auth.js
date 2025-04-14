import jwt from "jsonwebtoken";
import { findUserByEmail } from "@/app/lib/models/user";

const SECRET_KEY = process.env.JWT_SECRET;

export async function authenticateToken(req) {
  try {
    const authHeader = req.headers.get("authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return { error: "Missing or invalid Authorization header" };
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, SECRET_KEY);

    const user = await findUserByEmail(decoded.email);
    if (!user) return { error: "User not found" };
    if (!user.isVerified) return { error: "User email not verified" };
    if (!user.isApproved) return { error: "User not approved yet" };

    return { user }; // Authenticated user info
  } catch (error) {
    return { error: "Invalid token" };
  }
}
