// app/api/cv/list/route.ts
import { NextResponse } from "next/server";
import { supabase } from "@/app/(lib)/supabaseClient";

export async function GET() {
  try {
    const { data: cvs, error } = await supabase
      .from("cv_files")
      .select("*")
      .order("uploaded_at", { ascending: false });

    if (error) {
      console.error("Database error:", error);
      return NextResponse.json(
        { success: false, error: "Failed to fetch CVs" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      cvs: cvs || []
    });
  } catch (error) {
    console.error("Server error:", error);
    return NextResponse.json(
      { success: false, error: "Server error" },
      { status: 500 }
    );
  }
}