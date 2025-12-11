// app/api/contact/route.ts
import { NextResponse } from "next/server";
import { supabase } from "@/app/(lib)/supabaseClient";
import { sendContactNotification, sendAutoReply } from "@/app/(lib)/emailService";

export async function POST(request: Request) {
  try {
    const { name, email, message } = await request.json();

    // Validate input
    if (!name || !email || !message) {
      return NextResponse.json(
        { success: false, error: "All fields are required" },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: "Invalid email address" },
        { status: 400 }
      );
    }

    // Save to database
    const { data, error } = await supabase
      .from("messages")
      .insert([{ name, email, message }])
      .select()
      .single();

    if (error) {
      console.error("Database error:", error);
      return NextResponse.json(
        { success: false, error: "Failed to save message" },
        { status: 500 }
      );
    }

    // Send email notifications (don't wait for them, run in background)
    Promise.all([
      sendContactNotification({ name, email, message }),
      sendAutoReply({ name, email, message })
    ]).catch(emailError => {
      // Log email errors but don't fail the request
      console.error("Email notification error:", emailError);
    });

    return NextResponse.json({
      success: true,
      message: "Message sent successfully!",
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