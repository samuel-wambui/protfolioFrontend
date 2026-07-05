type DatedItem = {
  id: number;
  endDate?: string | null;
  startDate?: string | null;
};

export function sortByDisplayDateDesc<TItem extends DatedItem>(items: TItem[]): TItem[] {
  return [...items].sort((left, right) => {
    const dateDifference = dateSortValue(right) - dateSortValue(left);

    if (dateDifference !== 0) {
      return dateDifference;
    }

    return left.id - right.id;
  });
}

function dateSortValue(item: DatedItem): number {
  return parseDateValue(item.endDate) ?? parseDateValue(item.startDate) ?? Number.NEGATIVE_INFINITY;
}

function parseDateValue(value?: string | null): number | null {
  const normalized = typeof value === "string" ? value.trim() : "";
  if (!normalized) {
    return null;
  }

  const timestamp = Date.parse(normalized);
  return Number.isNaN(timestamp) ? null : timestamp;
}
