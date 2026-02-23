export const clpFormatter = new Intl.NumberFormat("es-CL", {
  style: "currency",
  currency: "CLP",
  maximumFractionDigits: 0,
});

export function formatCLP(value: number | null | undefined): string {
  return clpFormatter.format(value ?? 0);
}

export function formatPercent(value: number | null | undefined): string {
  const amount = value ?? 0;
  return `${amount.toFixed(1)}%`;
}
