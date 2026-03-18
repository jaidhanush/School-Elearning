import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const statusStyles: Record<string, string> = {
  APPROVED: "bg-success/10 text-success border-success/20",
  PENDING: "bg-warning/10 text-warning border-warning/20",
  REJECTED: "bg-destructive/10 text-destructive border-destructive/20",
  PRESENT: "bg-success/10 text-success border-success/20",
  ABSENT: "bg-destructive/10 text-destructive border-destructive/20",
  LATE: "bg-warning/10 text-warning border-warning/20",
};

export function StatusBadge({ status }: { status: string }) {
  return (
    <Badge variant="outline" className={cn("font-medium", statusStyles[status] ?? "")}>
      {status}
    </Badge>
  );
}
