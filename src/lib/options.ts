export const CLASSES = [5, 6, 7, 8, 9, 10, 11].flatMap((g) =>
  ["A", "B", "D", "E"].map((l) => `${g}-${l}`),
);

export const LOCATIONS = [
  "classroom",
  "canteen",
  "sports_hall",
  "library",
  "corridor",
  "schoolyard",
  "school_bus",
  "computer_room",
  "other",
] as const;

export const CATEGORIES = [
  "bag",
  "clothes",
  "electronics",
  "books",
  "bottle",
  "keys",
  "jewelry",
  "sports",
  "other",
] as const;

export const KEPT_AT = ["teachers_room", "duty_teacher", "deputy_room", "with_me"] as const;
