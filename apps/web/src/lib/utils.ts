import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatRelativeTime(date: Date | string) {
  return formatDistanceToNow(date, { addSuffix: true, locale: ptBR });
}

export function truncateText(text: string, maxLength: number) {
  return text.length <= maxLength ? text : text.slice(0, maxLength).trimEnd() + "…";
}
