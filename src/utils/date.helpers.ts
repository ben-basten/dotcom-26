export function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function compareByDateDesc(
  a: { data: { date?: Date } },
  b: { data: { date?: Date } },
): number {
  return (b.data.date?.getTime() ?? 0) - (a.data.date?.getTime() ?? 0);
}
