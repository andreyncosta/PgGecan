import { useState, useMemo } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatCurrency, formatPercent, type Unidade } from "@/lib/mock-data";
import { useUnidadesData } from "@/hooks/use-unidades";
import { UnidadesLoadState } from "@/components/UnidadesLoadState";
import { ArrowUpDown, Download, Search, TrendingUp, TrendingDown, Medal } from "lucide-react";
import { useNavigate } from "react-router-dom";

type SortKey = "resultado" | "rla" | "producaoTotal" | "atendimentoTotal" | "clientes" | "dea" | "receitaColab" | "metasMedia" | "taxaConversao";

const sortOptions: { key: SortKey; label: string }[] = [
  { key: "resultado", label: "Resultado Líquido" },
  { key: "rla", label: "RLA" },
  { key: "producaoTotal", label: "Produção Total" },
  { key: "atendimentoTotal", label: "Atendimentos" },
  { key: "clientes", label: "Clientes" },
  { key: "dea", label: "DEA" },
  { key: "receitaColab", label: "Receita/Colab" },
  { key: "metasMedia", label: "Metas %" },
  { key: "taxaConversao", label: "Taxa Conversão" },
];

function compactCurrency(v: number): string {
  const abs = Math.abs(v);
  const sign = v < 0 ? "-" : "";
  if (abs >= 1e9) return `${sign}R$ ${(abs / 1e9).toFixed(1)}B`;
  if (abs >= 1e6) return `${sign}R$ ${(abs / 1e6).toFixed(1)}M`;
  if (abs >= 1e3) return `${sign}R$ ${(abs / 1e3).toFixed(0)}K`;
  return `${sign}R$ ${abs.toFixed(0)}`;
}

function getMedalColor(pos: number): string {
  if (pos === 1) return "text-yellow-500";
  if (pos === 2) return "text-gray-400";
  if (pos === 3) return "text-amber-700";
  return "text-muted-foreground";
}

export default function RankingComparativos() {
  const navigate = useNavigate();
  const { unidades, isLoading, error } = useUnidadesData();
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("resultado");
  const [sortAsc, setSortAsc] = useState(false);

  const sorted = useMemo(() => {
    let data = unidades.filter(u =>
      u.nome.toLowerCase().includes(search.toLowerCase()) ||
      u.uf.toLowerCase().includes(search.toLowerCase())
    );
    data.sort((a, b) => {
      let av: number, bv: number;
      if (sortKey === "taxaConversao") {
        av = parseFloat(a.taxaConversao || "0");
        bv = parseFloat(b.taxaConversao || "0");
      } else {
        av = a[sortKey] as number;
        bv = b[sortKey] as number;
      }
      return sortAsc ? av - bv : bv - av;
    });
    return data;
  }, [unidades, search, sortKey, sortAsc]);

  const sortLabel = sortOptions.find(o => o.key === sortKey)?.label || "";

  if (isLoading || error) return <UnidadesLoadState loading={isLoading} error={error} />;

  return (
    <AppLayout>
      <div className="p-6 space-y-5 max-w-[1400px]">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold">Ranking e Comparativos</h1>
            <p className="text-sm text-muted-foreground">{sorted.length} unidades • Ordenado por {sortLabel}</p>
          </div>
          <div className="flex items-center gap-2">
            <Select value={sortKey} onValueChange={(v) => { setSortKey(v as SortKey); setSortAsc(false); }}>
              <SelectTrigger className="w-[180px] h-8 text-xs"><SelectValue /></SelectTrigger>
              <SelectContent>
                {sortOptions.map(o => (
                  <SelectItem key={o.key} value={o.key}>{o.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm" onClick={() => setSortAsc(!sortAsc)} className="h-8 px-2">
              <ArrowUpDown className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm" className="gap-2 h-8">
              <Download className="w-4 h-4" /> Exportar
            </Button>
          </div>
        </div>

        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Buscar unidade ou UF..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 h-9" />
        </div>

        <div className="space-y-2">
          {sorted.map((u, idx) => {
            const pos = idx + 1;
            const taxaConv = parseFloat(u.taxaConversao || "0");
            return (
              <Card
                key={u.id}
                className="hover:shadow-md transition-all cursor-pointer group"
                onClick={() => navigate(`/unidade/${u.id}`)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    {/* Position */}
                    <div className="flex flex-col items-center w-10 shrink-0">
                      {pos <= 3 ? (
                        <Medal className={`w-6 h-6 ${getMedalColor(pos)}`} />
                      ) : (
                        <span className="text-lg font-bold text-muted-foreground">{pos}º</span>
                      )}
                    </div>

                    {/* Name + code */}
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-sm truncate group-hover:text-primary transition-colors">{u.nome}</p>
                      <p className="text-[10px] text-muted-foreground">{u.codigo} • {u.uf}</p>
                    </div>

                    {/* Metrics grid */}
                    <div className="hidden md:grid grid-cols-5 gap-6 text-right">
                      <div>
                        <p className="text-[9px] text-muted-foreground uppercase">Resultado</p>
                        <p className={`text-sm font-bold font-mono ${u.resultado >= 0 ? "text-emerald-600" : "text-red-500"}`}>
                          {compactCurrency(u.resultado)}
                        </p>
                      </div>
                      <div>
                        <p className="text-[9px] text-muted-foreground uppercase">RLA</p>
                        <p className="text-sm font-bold font-mono">{compactCurrency(u.rla)}</p>
                      </div>
                      <div>
                        <p className="text-[9px] text-muted-foreground uppercase">Atendimentos</p>
                        <p className="text-sm font-bold font-mono">{u.atendimentoTotal.toLocaleString("pt-BR")}</p>
                      </div>
                      <div>
                        <p className="text-[9px] text-muted-foreground uppercase">Clientes</p>
                        <p className="text-sm font-bold font-mono">{u.clientes.toLocaleString("pt-BR")}</p>
                      </div>
                      <div>
                        <p className="text-[9px] text-muted-foreground uppercase">Tx. Conversão</p>
                        <p className="text-sm font-bold font-mono">{taxaConv.toFixed(0)}%</p>
                      </div>
                    </div>

                    {/* Metas badge */}
                    <Badge
                      variant={u.metasMedia >= 100 ? "default" : u.metasMedia >= 90 ? "secondary" : "destructive"}
                      className="shrink-0 text-[10px]"
                    >
                      {formatPercent(u.metasMedia)}
                    </Badge>

                    {/* Trend arrow */}
                    {u.resultado >= 0
                      ? <TrendingUp className="w-4 h-4 text-emerald-500 shrink-0" />
                      : <TrendingDown className="w-4 h-4 text-red-500 shrink-0" />
                    }
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </AppLayout>
  );
}
