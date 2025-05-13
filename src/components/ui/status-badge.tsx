
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: string;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "bg-green-100 text-green-800";
      case "completed":
        return "bg-blue-100 text-blue-800";
      case "paused":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium",
        getStatusColor(status),
        className
      )}
    >
      {(() => {
        switch (status.toLowerCase()) {
          case "active":
            return "Aktif";
          case "completed":
            return "Selesai";
          case "paused":
            return "Ditunda";
          case "cancelled":
            return "Dibatalkan";
          default:
            return status.charAt(0).toUpperCase() + status.slice(1);
        }
      })()}

    </div>
  );
}
