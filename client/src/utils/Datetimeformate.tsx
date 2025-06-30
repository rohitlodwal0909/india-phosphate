
import { parse, format, isValid } from 'date-fns';

export function formatDate(value: any) {
  if (!value || typeof value !== "string") return "-"; // Safety check
  const parsed = parse(value, 'yyyy-MM-dd', new Date());
  return isValid(parsed) ? format(parsed, 'dd-MMM-yyyy') : '-';
}

export function formatTime(value: any) {
  if (!value || typeof value !== "string") return "-"; // Safety check
  const parsed = parse(value, 'HH:mm:ss', new Date());
  return isValid(parsed) ? format(parsed, 'hh:mm a') : '-';
}