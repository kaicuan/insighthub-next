import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Globe, LockKeyhole } from "lucide-react";

export function VisibilityBadge({
  isPublic,
  className="",
}: {
  isPublic:boolean,
  className?: string;
}) {
  return (
    <Badge
      variant="secondary"
      className={cn(
        "flex items-center gap-1 h-6 px-1.5 text-xs font-medium",
        isPublic
          ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300"
          : "bg-slate-200 text-slate-800 dark:bg-slate-800 dark:text-slate-300",
        className
      )}
    >
      {isPublic ? (
        <>
          <Globe className="w-3 h-3 flex-shrink-0" />
          Public
        </>
      ) : (
        <>
          <LockKeyhole className="w-3 h-3 flex-shrink-0" />
          Private
        </>
      )}
    </Badge>
  );
}