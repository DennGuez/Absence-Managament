import type { DateItem } from "../types";

// Date management
export const currentYear: number = new Date().getFullYear();
export const today: Date = new Date();

export const yearDates = computed<DateItem[]>(() => {
  const dates: DateItem[] = [];
  const start = new Date(currentYear, 0, 1);
  const end = new Date(currentYear, 11, 31);
  
  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    dates.push({
      date: new Date(d),
      dateString: d.toISOString().split('T')[0]!
    });
  }
  return dates;
});