import { cn } from "@/lib/utils";

interface AuthErrorProps {
  message: string | null;
  className?: string;
}

export function AuthError({ message, className }: AuthErrorProps) {
  if (!message) return null;

  return (
    <div
      className={cn(
        "rounded-lg border border-danger-200 bg-danger-50 px-4 py-3 text-sm text-danger-700",
        className,
      )}
      role="alert"
    >
      {message}
    </div>
  );
}
