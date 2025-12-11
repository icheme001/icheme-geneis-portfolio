// app/api/projects/delete/route.ts
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/app/(lib)/supabaseAdmin";
import { revalidatePath } from "next/cache";

export async function POST(request: Request) {
  try {
    const { id } = await request.json();

    // Validate input
    if (!id) {
      return NextResponse.json(
        { success: false, error: "Project ID is required" },
        { status: 400 }
      );
    }

    // Delete project from database using service key (bypasses RLS)
    const { error } = await supabaseAdmin
      .from("projects")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Database error:", error);
      return NextResponse.json(
        { success: false, error: "Failed to delete project" },
        { status: 500 }
      );
    }

    // Revalidate all project-related pages
    revalidatePath("/projects");
    revalidatePath("/admin/projects");
    revalidatePath("/"); // Homepage if it shows projects

    return NextResponse.json({
      success: true,
      message: "Project deleted successfully"
    });
  } catch (error) {
    console.error("Server error:", error);
    return NextResponse.json(
      { success: false, error: "Server error" },
      { status: 500 }
    );
  }
}