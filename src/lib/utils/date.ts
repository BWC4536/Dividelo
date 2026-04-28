import {
  format,
  formatDistanceToNow,
  isToday,
  isYesterday,
  parseISO,
} from "date-fns";
import { es } from "date-fns/locale";

export function formatDate(date: Date | string, pattern = "dd/MM/yyyy"): string {
  const d = typeof date === "string" ? parseISO(date) : date;
  return format(d, pattern, { locale: es });
}

export function formatRelativeDate(date: Date | string): string {
  const d = typeof date === "string" ? parseISO(date) : date;

  if (isToday(d)) {
    return `Hoy a las ${format(d, "HH:mm")}`;
  }

  if (isYesterday(d)) {
    return `Ayer a las ${format(d, "HH:mm")}`;
  }

  return formatDistanceToNow(d, { addSuffix: true, locale: es });
}

export function formatShortDate(date: Date | string): string {
  const d = typeof date === "string" ? parseISO(date) : date;
  if (isToday(d)) return "Hoy";
  if (isYesterday(d)) return "Ayer";
  return format(d, "d MMM", { locale: es });
}

export function toISOString(date: Date | string): string {
  const d = typeof date === "string" ? parseISO(date) : date;
  return d.toISOString();
}
