import { describe, expect, it } from "vitest";
import { scoreMatches } from "@/lib/matching";
import type { Item } from "@/lib/items";

const item = (overrides: Partial<Item>): Item => ({
  id: crypto.randomUUID(),
  kind: "lost",
  title: "Blue notebook",
  description: "math notes",
  category: "books",
  location: "library",
  class_name: null,
  kept_at: null,
  item_date: "2026-10-01",
  photo_url: null,
  status: "searching",
  created_at: "2026-10-01",
  updated_at: "2026-10-01",
  owner_user_id: "owner-a",
  owner_deleted_at: null,
  deleted_by_owner: false,
  custom_category: null,
  custom_location: null,
  custom_kept_at: null,
  ...overrides,
});

describe("scoreMatches", () => {
  it("matches opposite active reports and excludes own or resolved reports", () => {
    const source = item({});
    const result = scoreMatches(
      source,
      [
        item({ id: "found", kind: "found", owner_user_id: "owner-b" }),
        item({ id: "own", kind: "found", owner_user_id: "owner-a" }),
        item({ id: "resolved", kind: "found", owner_user_id: "owner-b", status: "returned" }),
      ],
      "owner-a",
    );
    expect(result.map(({ item: match }) => match.id)).toEqual(["found"]);
  });

  it("supports custom Other values and returns no empty-field matches", () => {
    const source = item({
      title: "",
      description: "",
      category: "other",
      custom_category: "silver water bottle",
    });
    const result = scoreMatches(source, [
      item({
        id: "custom",
        kind: "found",
        title: "",
        description: "",
        category: "other",
        custom_category: "silver water bottle",
        owner_user_id: "owner-b",
      }),
    ]);
    expect(result[0]?.level).toBe("high");
    expect(
      scoreMatches(source, [
        item({
          id: "empty",
          kind: "found",
          title: "",
          description: "",
          category: "electronics",
          custom_category: null,
          owner_user_id: "owner-b",
        }),
      ]),
    ).toHaveLength(0);
  });
});
