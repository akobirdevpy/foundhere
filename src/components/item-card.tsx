import { Link } from "@tanstack/react-router";
import { ImageOff, MapPin } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { usePhotoUrl, type Item } from "@/lib/items";
import { cn } from "@/lib/utils";

export function KindBadge({ kind }: { kind: string }) {
  const { t } = useI18n();
  return (
    <span className={cn("rounded-sm px-2.5 py-0.5 text-xs font-semibold", kind === "returned" ? "bg-secondary text-secondary-foreground" : kind === "found" ? "bg-success text-success-foreground" : "bg-lost text-lost-foreground")}>
      {t(kind)}
    </span>
  );
}

export function ItemCard({ item }: { item: Item }) {
  const { t } = useI18n();
  const url = usePhotoUrl(item.photo_url);
  return (
    <Link to="/items/$id" params={{ id: item.id }} className="group overflow-hidden rounded-lg border bg-card shadow-sm transition hover:shadow-md">
      <div className="flex aspect-[4/3] items-center justify-center bg-secondary">
        {url ? <img src={url} alt={item.title} className="h-full w-full object-cover" /> : <ImageOff className="h-8 w-8 text-muted-foreground" />}
      </div>
      <div className="space-y-2 p-4">
        <div className="flex items-center justify-between gap-2">
          <KindBadge kind={item.kind} />
          <span className="text-xs text-muted-foreground">{item.item_date}</span>
        </div>
        <h3 className="font-serif text-base font-semibold group-hover:text-primary">{item.title}</h3>
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <MapPin className="h-3 w-3" /> {t(item.location)} · {t(item.category)}
        </div>
      </div>
    </Link>
  );
}
