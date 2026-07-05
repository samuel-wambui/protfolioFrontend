export const DEFAULT_PORTFOLIO_ID = "PORT001";

export function normalizePortfolioId(portfolioId: string | null | undefined): string {
  const normalized = portfolioId?.trim().toUpperCase();
  return normalized || DEFAULT_PORTFOLIO_ID;
}

export function getConfiguredPortfolioId(): string {
  return normalizePortfolioId(process.env.NEXT_PUBLIC_PORTFOLIO_ID);
}

export function withPortfolioId(path: string, portfolioId: string | null | undefined): string {
  const separator = path.includes("?") ? "&" : "?";
  return `${path}${separator}portfolioId=${encodeURIComponent(normalizePortfolioId(portfolioId))}`;
}
