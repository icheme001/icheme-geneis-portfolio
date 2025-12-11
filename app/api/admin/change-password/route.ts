// app/api/admin/change-password/route.ts
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
    const { currentPassword, newPassword } = await req.json();

    // Validate input
    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { success: false, error: "Both passwords are required" },
        { status: 400 }
      );
    }

    if (newPassword.length < 8) {
      return NextResponse.json(
        { success: false, error: "New password must be at least 8 characters" },
        { status: 400 }
      );
    }

    // Get current admin data with password
    const { data: admin, error: fetchError } = await supabase
      .from("admins")
      .select("id, email, password")
      .eq("id", session.admin_id)
      .single();

    if (fetchError || !admin) {
      return NextResponse.json(
        { success: false, error: "Admin not found" },
        { status: 404 }
      );
    }

    // Verify current password using PostgreSQL crypt function
    const { data: passwordCheck, error: verifyError } = await supabase.rpc(
      "verify_admin_password",
      {
        admin_id: session.admin_id,
        password_attempt: currentPassword
      }
    );

    if (verifyError || !passwordCheck) {
      return NextResponse.json(
        { success: false, error: "Current password is incorrect" },
        { status: 401 }
      );
    }

    // Hash and update new password using PostgreSQL crypt function
    const { error: updateError } = await supabase.rpc(
      "update_admin_password",
      {
        admin_id: session.admin_id,
        new_password: newPassword
      }
    );

    if (updateError) {
      console.error("Password update error:", updateError);
      return NextResponse.json(
        { success: false, error: "Failed to update password" },
        { status: 500 }
      );
    }

    // Optionally: Invalidate all other sessions for security
    await supabase
      .from("admin_sessions")
      .delete()
      .eq("admin_id", session.admin_id)
      .neq("token", token);

    return NextResponse.json({ 
      success: true, 
      message: "Password changed successfully" 
    });
  } catch (err) {
    console.error("Change password error:", err);
    return NextResponse.json(
      { success: false, error: "Server error" },
      { status: 500 }
    );
  }
}