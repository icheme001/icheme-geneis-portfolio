// app/api/admin/update-profile/route.ts
import { NextResponse } from "next/server";
import { supabase } from "@/app/(lib)/supabaseClient";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  try {
    // Get session token from cookies
    const cookieStore = await cookies();
    const token = cookieStore.get("admin_token")?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Verify token and get admin session
    const { data: session } = await supabase
      .from("admin_sessions")
      .select("admin_id")
      .eq("token", token)
      .single();

    if (!session) {
      return NextResponse.json(
        { success: false, error: "Invalid session" },
        { status: 401 }
      );
    }

    // Get request body
    const { name, email } = await req.json();

    // Validate input
    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { success: false, error: "Valid email is required" },
        { status: 400 }
      );
    }

    // Check if email is already taken by another admin
    const { data: existingAdmin } = await supabase
      .from("admins")
      .select("id")
      .eq("email", email)
      .neq("id", session.admin_id)
      .single();

    if (existingAdmin) {
      return NextResponse.json(
        { success: false, error: "Email already in use" },
        { status: 400 }
      );
    }

    // Update admin profile
    const updateData: any = { email };
    
    // Only update name if provided (assuming you add a name column to admins table)
    // if (name) updateData.name = name;

    const { error } = await supabase
      .from("admins")
      .update(updateData)
      .eq("id", session.admin_id);

    if (error) {
      console.error("Update profile error:", error);
      return NextResponse.json(
        { success: false, error: "Failed to update profile" },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      message: "Profile updated successfully" 
    });
  } catch (err) {
    console.error("Update profile error:", err);
    return NextResponse.json(
      { success: false, error: "Server error" },
      { status: 500 }
    );
  }
}