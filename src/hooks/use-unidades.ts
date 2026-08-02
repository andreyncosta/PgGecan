import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { loadUnidades } from "@/lib/load-unidades";

/** ms; 0 = off. Dev default 4000. Set VITE_UNIDADES_REFETCH_MS in .env.local for preview/static testing. */
function refetchIntervalMs(): number | false {
  const raw = import.meta.env.VITE_UNIDADES_REFETCH_MS;
  if (raw !== undefined && raw !== "" && String(raw).trim() !== "") {
    const n = Number(raw);
    if (Number.isFinite(n) && n > 0) return n;
    if (n === 0) return false;
  }
  return import.meta.env.DEV ? 4000 : false;
}

/**
 * Load and continuously sync the branch-unit ("unidades") dataset for the
 * dashboard.
 *
 * Wraps `loadUnidades` (see `@/lib/load-unidades`) in a React Query
 * subscription and layers on three things callers shouldn't have to
 * reason about themselves:
 *
 * - **Auto-refetch**: polls at `refetchIntervalMs()` (env-configurable via
 *   `VITE_UNIDADES_REFETCH_MS`; defaults to 4s in dev, off in production
 *   builds unless overridden), and also refetches on window focus,
 *   network reconnect, and every mount (`staleTime: 0`) — so any consumer
 *   always renders the freshest data without adding its own polling logic.
 * - **Empty-safe default**: `unidades` is always an array (`[]` before the
 *   first successful fetch), so consumers never need to null-check before
 *   mapping/filtering.
 * - **Derived filter lists**: `UFS`, `RAS`, and `UF_RAS` are memoized,
 *   deduplicated, sorted lists of the corresponding fields across all
 *   loaded unidades — ready to feed directly into filter dropdowns without
 *   recomputing on every render.
 *
 * Also re-exports every field from the underlying `useQuery` result
 * (`isLoading`, `isError`, `error`, `refetch`, etc.) so callers get full
 * React Query state alongside the derived `unidades`/`UFS`/`RAS`/`UF_RAS`.
 */
export function useUnidadesData() {
  const q = useQuery({
    queryKey: ["unidades", "json"],
    queryFn: loadUnidades,
    staleTime: 0,
    refetchInterval: refetchIntervalMs(),
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    refetchOnMount: "always",
  });

  const unidades = q.data ?? [];

  const lists = useMemo(() => {
    return {
      UFS: [...new Set(unidades.map((u) => u.uf))].sort(),
      RAS: [...new Set(unidades.map((u) => u.ra))].sort(),
      UF_RAS: [...new Set(unidades.map((u) => u.ufRa))].sort(),
    };
  }, [unidades]);

  return {
    ...q,
    unidades,
    UFS: lists.UFS,
    RAS: lists.RAS,
    UF_RAS: lists.UF_RAS,
  };
}
