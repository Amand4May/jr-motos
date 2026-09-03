export function formatPreco(preco: number) {
  return preco.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  });
}

export function formatKm(km: number | null) {
  if (km == null) return null;
  return `${km.toLocaleString("pt-BR")} km`;
}
