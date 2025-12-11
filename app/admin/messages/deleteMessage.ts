"use server";

import { supabase } from "../../(lib)/supabaseClient";
import { revalidatePath } from "next/cache";

export default async function deleteMessage(id: number) {
  const { error } = await supabase
    .from("messages")
    .delete()
    .eq("id", id);

  if (error) console.error(error);

  revalidatePath("/admin/messages");
}
