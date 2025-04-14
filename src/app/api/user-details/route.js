import { updateUser, findUserByEmail } from "@/app/lib/models/user";

export async function POST(req) {
  try {
    const {
      email,
      name,
      rollNo,
      branch,
      customBranch,
      dob,
      gender,
      phone,
      address,
    } = await req.json();

    if (!email) {
      return Response.json({ error: "Email is required." }, { status: 400 });
    }

    const user = await findUserByEmail(email);

    if (!user || !user.isVerified) {
      return Response.json({ error: "User not found or not verified." }, { status: 404 });
    }

    const finalBranch = branch === "Other" ? customBranch : branch;

    await updateUser(email, {
      name,
      rollNo,
      branch: finalBranch,
      dob,
      gender,
      phone,
      address,
      isProfileDone: true,
    });

    return Response.json({ message: "User details updated successfully." });
  } catch (error) {
    console.error("Error updating user details:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}