import { updateUser, findUserByEmail } from "@/app/lib/models/user";
import { sendMail } from "@/app/lib/email"; // This will be used for email

export async function POST(req) {
  const { email, action } = await req.json(); // action = "approve" or "reject"

  const user = await findUserByEmail(email);
  if (!user) return Response.json({ error: "User not found" }, { status: 404 });

  if (action === "approve") {
    await updateUser(email, { status: "approved" });
    await sendMail(email, "Account Approved ✅", "Congratulations🎉, Your account has been approved!");
  } else if (action === "reject") {
    await updateUser(email, { status: "rejected" });
    await sendMail(email, "Account Rejected ❌", "Sorry, your account request was declined.");
  } else {
    return Response.json({ error: "Invalid action" }, { status: 400 });
  }

  return Response.json({ message: `User ${action}d successfully` });
}