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
