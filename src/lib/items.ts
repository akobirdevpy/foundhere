import { queryOptions } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

export type Item = Tables<"items">;

export const itemsQuery = () =>
  queryOptions({
    queryKey: ["items"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("items")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(500);
      if (error) throw error;
      return data;
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

const words = (s: string) =>
  s.toLowerCase().split(/[^\p{L}\p{N}]+/u).filter((w) => w.length > 2);

export function findMatches(item: Item, all: Item[]) {
  const mine = new Set(words(`${item.title} ${item.description ?? ""}`));
  return all
    .filter((o) => o.kind !== item.kind)
    .map((o) => {
      let score = 0;
      if (o.category === item.category) score += 3;
      if (o.location === item.location) score += 1;
      for (const w of words(`${o.title} ${o.description ?? ""}`)) if (mine.has(w)) score += 2;
      return { o, score };
    })
    .filter((x) => x.score >= 3)
    .sort((a, b) => b.score - a.score)
    .slice(0, 6)
    .map((x) => x.o);
}
