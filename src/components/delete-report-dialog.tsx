import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { deleteReport } from "@/lib/delete-report";
import { useI18n } from "@/lib/i18n";

export function DeleteReportDialog({
  itemId,
  photoPath,
  onDeleted,
}: {
  itemId: string;
  photoPath?: string | null;
  onDeleted: () => void;
}) {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);

  async function confirmDelete() {
    setBusy(true);
    try {
      await deleteReport(itemId, photoPath);
      toast.success(t("deleted"));
      setOpen(false);
      onDeleted();
    } catch {
      toast.error(t("deleteError"));
    } finally {
      setBusy(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={(next) => !busy && setOpen(next)}>
      <Button variant="outline" onClick={() => setOpen(true)} disabled={busy}>
        {busy ? t("deleting") : t("delete")}
      </Button>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("deleteConfirm")}</DialogTitle>
          <DialogDescription>{t("deleteDescription")}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} disabled={busy}>
            {t("cancel")}
          </Button>
          <Button variant="destructive" onClick={confirmDelete} disabled={busy}>
            {busy ? t("deleting") : t("delete")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
