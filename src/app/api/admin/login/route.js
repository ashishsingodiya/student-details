export async function POST(req) {
    const { email, password } = await req.json();
  
    if (
      email === process.env.ADMIN_EMAIL &&
      password === process.env.ADMIN_PASSWORD
    ) {
      // Generate a simple session token for now (JWT optional)
      return Response.json({ message: "Admin login successful" });
    } else {
      return Response.json({ error: "Invalid admin credentials" }, { status: 401 });
    }
  }
