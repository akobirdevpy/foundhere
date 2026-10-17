import { supabase } from "@/integrations/supabase/client";

export async function deleteReport(itemId: string, photoPath?: string | null) {
  if (photoPath) {
    const { error: photoError } = await supabase.storage.from("item-photos").remove([photoPath]);
    if (photoError) throw photoError;
  }

  const { error } = await supabase.from("items").delete().eq("id", itemId);
  if (error) throw error;
}
