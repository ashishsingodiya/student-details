import { updateUser, findUserByEmail, deleteUser } from "@/app/lib/models/user";
import { sendMail } from "@/app/lib/email"; // This will be used for email

export async function POST(req) {
  const { email, action } = await req.json(); // action = "approve", "reject", "block", "unblock", or "delete"

  const user = await findUserByEmail(email);
  if (!user) return Response.json({ error: "User not found" }, { status: 404 });

  if (action === "approve") {
    await updateUser(email, { status: "approved" });
    await sendMail(email, "Account Approved ✅", "Congratulations🎉, Your account has been approved!");
  } else if (action === "reject") {
    await updateUser(email, { status: "rejected" });
    await sendMail(email, "Account Rejected ❌", "Sorry, your account request was declined.");
  } else if (action === "block") {
    await updateUser(email, { status: "blocked" });
    await sendMail(email, "Account Blocked 🚫", "Your account has been blocked. Please contact your admin for more details.");
  } else if (action === "unblock") {
    await updateUser(email, { status: "approved" });
    await sendMail(email, "Account Unblocked ✅", "Your account has been unblocked and is now approved!");
  } else if (action === "delete") {
    await deleteUser(email);
    await sendMail(email, "Account Deleted 🗑️", "Your account has been permanently deleted from our system.");
  } else {
    return Response.json({ error: "Invalid action" }, { status: 400 });
  }

  return Response.json({ message: `User ${action}ed successfully` });
}