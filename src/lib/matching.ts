/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Item } from "@/lib/items";

export type MatchLevel = "high" | "possible";
export type ScoredMatch = { item: Item; score: number; level: MatchLevel };

const normalize = (value: string) =>
  value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("und");

const words = (value: string | null | undefined) =>
  new Set(
    normalize(value ?? "")
      .split(/[^\p{L}\p{N}]+/u)
      .filter((word) => word.length > 2),
  );
const overlap = (a: Set<string>, b: Set<string>) => [...a].filter((word) => b.has(word)).length;
const active = (item: Item) =>
  !["returned", "resolved"].includes(item.status ?? "") &&
  !(item as any).owner_deleted_at &&
  !(item as any).deleted_by_owner;

export function scoreMatches(source: Item, candidates: Item[], ownerId?: string): ScoredMatch[] {
  const sourceWords = words(
    `${source.title} ${source.description ?? ""} ${(source as any).custom_category ?? ""} ${(source as any).custom_location ?? ""}`,
  );
  const sourceDate = source.item_date ? new Date(source.item_date).getTime() : 0;
  return candidates
    .filter(
      (candidate) =>
        candidate.id !== source.id &&
        candidate.kind !== source.kind &&
        active(candidate) &&
        (!ownerId || (candidate as any).owner_user_id !== ownerId),
    )
    .map((candidate) => {
      const candidateWords = words(
        `${candidate.title} ${candidate.description ?? ""} ${(candidate as any).custom_category ?? ""} ${(candidate as any).custom_location ?? ""}`,
      );
      const days =
        sourceDate && candidate.item_date
          ? Math.round((new Date(candidate.item_date).getTime() - sourceDate) / 86400000)
          : null;
      let score = 0;
      if (
        candidate.category === source.category ||
        (candidate as any).custom_category === (source as any).custom_category
      )
        score += 40;
      score += Math.min(30, overlap(sourceWords, candidateWords) * 8);
      if (
        candidate.location === source.location ||
        (candidate as any).custom_location === (source as any).custom_location
      )
        score += 15;
      if (days !== null && days >= -3 && days <= 30) score += 15;
      return {
        item: candidate,
        score,
        level: score >= 65 ? "high" : "possible",
      } satisfies ScoredMatch;
    })
    .filter((match) => match.score >= 35)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);
}
