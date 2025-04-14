// src/app/api/admin/users/route.js

import User from "@/app/lib/models/user"; // ensure this points to your Mongoose User model
import connectToDatabase from "@/app/lib/mongodb"; // Updated to the correct path

export async function GET(request) {
  try {
    // Ensure DB connection is established
    await connectToDatabase();
    // Fetch all users from the database
    const users = await User.find({}).lean();
    // Return the users in JSON format
    return new Response(JSON.stringify({ users }), { status: 200 });
  } catch (error) {
    console.error("Error fetching users:", error);
    return new Response(
      JSON.stringify({ error: "Failed to fetch users" }),
      { status: 500 }
    );
  }
}
