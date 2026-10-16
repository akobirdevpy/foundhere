import { queryOptions } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

export type Item = Omit<Tables<"items">, "kind" | "contact_name" | "contact_info"> & {
  kind: "lost" | "found";
  contact_name?: string | null;
  contact_info?: string | null;
};

export const itemsQuery = () =>
  queryOptions({
    queryKey: ["items"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("items")
        .select(
          "id, kind, title, description, category, location, class_name, kept_at, item_date, photo_url, status, created_at, updated_at, owner_user_id, owner_deleted_at, deleted_by_owner, custom_category, custom_location, custom_kept_at",
        )
        .order("created_at", { ascending: false })
        .limit(500);
      if (error) throw error;
      return data as Item[];
    },
  });

export function usePhotoUrl(path: string | null) {
  const [url, setUrl] = useState<string | null>(null);
  useEffect(() => {
    if (!path) return;
    supabase.storage
      .from("item-photos")
      .createSignedUrl(path, 3600)
      .then(({ data }) => setUrl(data?.signedUrl ?? null));
  }, [path]);
  return url;
}
