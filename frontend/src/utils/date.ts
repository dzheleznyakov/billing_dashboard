import { format, parseISO } from 'date-fns';

export function formatTimestamp(timestampISO: string): string {
  try {
    return format(parseISO(timestampISO), 'dd-MM-yyyy HH:mm');
  } catch {
    return timestampISO;
  }
}

export function formatDate(timestampISO: string): string {
  try {
    return format(parseISO(timestampISO), 'dd-MM-yyyy');
  } catch {
    return timestampISO;
  }
}

export function formatDayKey(timestampISO: string): string {
  try {
    return format(parseISO(timestampISO), 'yyyy-MM-dd');
  } catch {
    return timestampISO;
  }
}
