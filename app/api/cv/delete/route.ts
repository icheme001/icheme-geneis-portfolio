// app/api/cv/delete/route.ts
import { NextResponse } from "next/server";
import { supabase } from "@/app/(lib)/supabaseClient";

export async function POST(request: Request) {
  try {
    const { id } = await request.json();

    if (!id) {
      return NextResponse.json(
        { success: false, error: "CV ID is required" },
        { status: 400 }
      );
    }

    // First get the file URL to potentially delete from storage
    const { data: cvData, error: fetchError } = await supabase
      .from("cv_files")
      .select("file_url")
      .eq("id", id)
      .single();

    if (fetchError) {
      console.error("Fetch error:", fetchError);
      return NextResponse.json(
        { success: false, error: "CV not found" },
        { status: 404 }
      );
    }

    // Delete from database
    const { error: deleteError } = await supabase
      .from("cv_files")
      .delete()
      .eq("id", id);

    if (deleteError) {
      console.error("Delete error:", deleteError);
      return NextResponse.json(
        { success: false, error: "Failed to delete CV" },
        { status: 500 }
      );
    }

    // Optional: Delete file from Supabase Storage if using it
    // const fileName = cvData.file_url.split('/').pop();
    // if (fileName) {
    //   await supabase.storage.from('cvs').remove([fileName]);
    // }

    return NextResponse.json({
      success: true,
      message: "CV deleted successfully"
    });
  } catch (error) {
    console.error("Server error:", error);
    return NextResponse.json(
      { success: false, error: "Server error" },
      { status: 500 }
    );
  }
}