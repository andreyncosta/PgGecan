import type { Unidade } from "@/lib/mock-data";

/**
 * URL absoluta ou caminho (ex.: /data/unidades.json).
 * Defina VITE_UNIDADES_JSON_URL no .env para servir JSON fora do build (CDN, API estática, etc.).
 */
export function getUnidadesJsonUrl(): string {
  const v = import.meta.env.VITE_UNIDADES_JSON_URL;
  if (v && String(v).trim() !== "") return String(v).trim();
  return "/data/unidades.json";
}

function withCacheBust(url: string): string {
  const sep = url.includes("?") ? "&" : "?";
  return `${url}${sep}_=${Date.now()}`;
}

export async function loadUnidades(): Promise<Unidade[]> {
  let url = getUnidadesJsonUrl();
  // Always bust HTTP cache so refetches get the latest file (dev, preview, prod behind CDN).
  url = withCacheBust(url);
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) {
    throw new Error(`Falha ao carregar unidades (${res.status}): ${url}`);
  }
  const data = await res.json();
  if (!Array.isArray(data)) {
    throw new Error("JSON de unidades deve ser um array");
  }
  return data as Unidade[];
}
