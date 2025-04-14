import { authenticateToken } from "@/app/lib/auth";

export async function GET(req) {
  const { user, error } = await authenticateToken(req);
  if (error) return Response.json({ error }, { status: 401 });

  return Response.json({
    email: user.email,
    name: user.name,
    rollNo: user.rollNo,
    branch: user.branch,
    mobile: user.mobile,
    address: user.address,
  });
}