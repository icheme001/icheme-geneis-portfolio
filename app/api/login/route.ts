// app/api/login/route.ts
import { NextResponse } from "next/server";
import { supabase } from "@/app/(lib)/supabaseClient";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    if (!email || !password) return NextResponse.json({ success: false, error: "Missing fields" }, { status: 400 });

    // Fetch the admin row
    const { data: admins, error } = await supabase.from("admins").select("id, email, password").eq("email", email).limit(1);

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json({ success: false, error: "DB error" }, { status: 500 });
    }

    const admin = admins && admins[0];
    if (!admin) return NextResponse.json({ success: false, error: "Invalid credentials" }, { status: 401 });

    // Verify password using Postgres crypt hash comparison via RPC would be ideal,
    // but here we'll fetch the hashed password and compare in JS if using bcrypt.
    // For demo, assume passwords stored as bcrypt hashes and verify with bcrypt.

    const bcrypt = await import("bcryptjs");
    const match = await bcrypt.compare(password, admin.password);

    if (!match) return NextResponse.json({ success: false, error: "Invalid credentials" }, { status: 401 });

    // Create a simple session token and store in admin_sessions table
    const token = crypto.randomUUID();
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toISOString(); // 7 days

    const { error: insertErr } = await supabase.from("admin_sessions").insert([{ admin_id: admin.id, token, expires_at: expiresAt }]);

    if (insertErr) {
      console.error("Session insert error:", insertErr);
      return NextResponse.json({ success: false, error: "Could not create session" }, { status: 500 });
    }

    const res = NextResponse.json({ success: true });
    // Set cookie with token (httpOnly not available in NextResponse.setHeader cookie easily for App Router,
    // but we can set cookie header. In production, use secure, httpOnly cookies set from server code/Edge)
    res.headers.set("Set-Cookie", `admin_token=${token}; Path=/; Max-Age=${60 * 60 * 24 * 7}; SameSite=Lax; HttpOnly`);

    return res;
  } catch (err) {
    console.error("Login route error:", err);
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}
