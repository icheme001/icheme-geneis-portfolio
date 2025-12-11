// app/api/projects/update/route.ts
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/app/(lib)/supabaseAdmin";
import { revalidatePath } from "next/cache";

export async function POST(request: Request) {
  try {
    // Parse FormData instead of JSON
    const formData = await request.formData();
    
    const id = formData.get("id") as string;
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const github = formData.get("github") as string;
    const url = formData.get("url") as string;
    const tagsString = formData.get("tags") as string;
    const imageFile = formData.get("file") as File | null;

    // Validate required fields
    if (!id || !title) {
      return NextResponse.json(
        { success: false, error: "ID and title are required" },
        { status: 400 }
      );
    }

    // Parse tags (convert comma-separated string to array)
    const tags = tagsString
      ? tagsString.split(",").map((tag) => tag.trim()).filter(Boolean)
      : [];

    // Handle image upload if provided
    let imageUrl = null;
    if (imageFile && imageFile.size > 0) {
      // Option 1: Upload to Supabase Storage
      const fileName = `${Date.now()}-${imageFile.name}`;
      const { data: uploadData, error: uploadError } = await supabaseAdmin
        .storage
        .from("project-img") // Make sure this bucket exists
        .upload(fileName, imageFile, {
          cacheControl: "3600",
          upsert: false
        });

      if (uploadError) {
        console.error("Image upload error:", uploadError);
        // Continue without updating image if upload fails
      } else {
        // Get public URL
        const { data: { publicUrl } } = supabaseAdmin
          .storage
          .from("project-img")
          .getPublicUrl(fileName);
        
        imageUrl = publicUrl;
      }
    }

    // Prepare update data
    const updateData: any = {
      title,
      description,
      github,
      url,
      tags
    };

    // Only update image if new one was uploaded
    if (imageUrl) {
      updateData.image = imageUrl;
    }

    // Update project in database using service key (bypasses RLS)
    const { data, error } = await supabaseAdmin
      .from("projects")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Database error:", error);
      return NextResponse.json(
        { success: false, error: "Failed to update project" },
        { status: 500 }
      );
    }

    // Revalidate all project-related pages
    revalidatePath("/projects");
    revalidatePath("/admin/projects");
    revalidatePath(`/projects/${id}`);
    revalidatePath("/"); // Homepage if it shows projects

    return NextResponse.json({
      success: true,
      message: "Project updated successfully",
      data
    });
  } catch (error) {
    console.error("Server error:", error);
    return NextResponse.json(
      { success: false, error: "Server error" },
      { status: 500 }
    );
  }
}