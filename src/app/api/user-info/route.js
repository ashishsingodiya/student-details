import jwt from "jsonwebtoken";
import { findUserByEmail } from "@/app/lib/models/user";

const SECRET_KEY = process.env.JWT_SECRET || "your-secret-key";

export async function GET(req) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader) return Response.json({ error: "Unauthorized" }, { status: 401 });

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, SECRET_KEY);

    const user = await findUserByEmail(decoded.email);
    if (!user) return Response.json({ error: "User not found" }, { status: 404 });

    return Response.json({ user });
  } catch (error) {
    return Response.json({ error: "Invalid token" }, { status: 401 });
  }
}