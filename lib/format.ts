export function formatDate(value?: string | null): string {
  const normalized = normalizeDateValue(value);
  if (!normalized) {
    return "Date not set";
  }

  const date = new Date(normalized);
  if (Number.isNaN(date.getTime())) {
    return normalized;
  }

  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

export function formatDateRange(startDate?: string | null, endDate?: string | null): string {
  const normalizedStart = normalizeDateValue(startDate);
  const normalizedEnd = normalizeDateValue(endDate);

  if (!normalizedStart && !normalizedEnd) {
    return "Date not set";
  }

  if (!normalizedStart) {
    return `Until ${formatDate(normalizedEnd)}`;
  }

  const start = formatDate(startDate);
  return normalizedEnd ? `${start} - ${formatDate(normalizedEnd)}` : `${start} - Present`;
}

function normalizeDateValue(value?: string | null): string {
  return typeof value === "string" ? value.trim() : "";
}

export function groupBy<TItem, TKey extends string>(
  items: TItem[],
  getKey: (item: TItem) => TKey,
): Record<TKey, TItem[]> {
  return items.reduce(
    (groups, item) => {
      const key = getKey(item);
      groups[key] = groups[key] ?? [];
      groups[key].push(item);
      return groups;
    },
    {} as Record<TKey, TItem[]>,
  );
}
