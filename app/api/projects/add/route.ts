// app/api/projects/add/route.ts
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/app/(lib)/supabaseAdmin";
import { revalidatePath } from "next/cache";

export async function POST(request: Request) {
  try {
    const contentType = request.headers.get("content-type");
    
    let body;
    let imageFile: File | null = null;
    
    if (contentType?.includes("application/json")) {
      try {
        body = await request.json();
      } catch (jsonError) {
        console.error("JSON parse error:", jsonError);
        return NextResponse.json(
          { success: false, error: "Invalid JSON in request body" },
          { status: 400 }
        );
      }
    } else if (contentType?.includes("multipart/form-data")) {
      const formData = await request.formData();
      
      // Get the file
      imageFile = formData.get("file") as File | null; // ✅ Changed from "image" to "file"
      
      body = {
        title: formData.get("title")?.toString() || "",
        description: formData.get("description")?.toString() || "",
        github: formData.get("github")?.toString() || "",
        url: formData.get("url")?.toString() || "",
        tags: formData.get("tags") ? JSON.parse(formData.get("tags")?.toString() || "[]") : []
      };
    } else {
      return NextResponse.json(
        { success: false, error: "Unsupported content type" },
        { status: 400 }
      );
    }

    const { title, description, github, url, tags } = body;

    if (!title || title.trim() === "") {
      return NextResponse.json(
        { success: false, error: "Title is required" },
        { status: 400 }
      );
    }

    let imageUrl = null;

    // Upload image to Supabase Storage if provided
    if (imageFile && imageFile.size > 0) {
      try {
        const fileExtension = imageFile.name.split(".").pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExtension}`;
        
        const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
          .from("project-img") // ✅ Make sure this bucket exists
          .upload(`projects/${fileName}`, imageFile);

        if (uploadError) {
          console.error("Image upload error:", uploadError);
          return NextResponse.json(
            { success: false, error: `Failed to upload image: ${uploadError.message}` },
            { status: 500 }
          );
        }

        // Get the public URL
        const { data } = supabaseAdmin.storage
          .from("project-img")
          .getPublicUrl(`projects/${fileName}`);
        
        imageUrl = data.publicUrl;
      } catch (uploadError) {
        console.error("Image processing error:", uploadError);
        return NextResponse.json(
          { success: false, error: "Failed to process image" },
          { status: 500 }
        );
      }
    }

    // Insert project into database
    const { data, error } = await supabaseAdmin
      .from("projects")
      .insert([{
        title: title.trim(),
        description: description?.trim() || null,
        github: github?.trim() || null,
        url: url?.trim() || null,
        image: imageUrl, // ✅ Store the actual image URL
        tags: Array.isArray(tags) ? tags : []
      }])
      .select()
      .single();

    if (error) {
      console.error("Database error:", error);
      return NextResponse.json(
        { success: false, error: `Failed to create project: ${error.message}` },
        { status: 500 }
      );
    }

    try {
      revalidatePath("/projects");
      revalidatePath("/admin/projects");
      revalidatePath("/");
    } catch (revalidateError) {
      console.error("Revalidate error:", revalidateError);
    }

    return NextResponse.json({
      success: true,
      message: "Project created successfully",
      data,
      imageUrl // ✅ Return the image URL
    });
  } catch (error) {
    console.error("Server error:", error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : "Server error" 
      },
      { status: 500 }
    );
  }
}