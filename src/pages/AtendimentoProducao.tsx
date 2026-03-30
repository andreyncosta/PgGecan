import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { formatCurrency, formatPercent } from "@/lib/mock-data";
import { useUnidadesData } from "@/hooks/use-unidades";
import { UnidadesLoadState } from "@/components/UnidadesLoadState";
import {
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, ReferenceLine, LineChart, Line, BarChart, Bar,
} from "recharts";
import { Users, Landmark, Briefcase, Activity, TrendingUp } from "lucide-react";

const COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
];

const tooltipStyle = {
  backgroundColor: "hsl(var(--card))",
  border: "1px solid hsl(var(--border))",
  borderRadius: 8,
  fontSize: 12,
};

const MESES = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];

function genMonthlyData(total: number, seed: number) {
  return MESES.map((mes, i) => {
    const base = total / 12;
    const variation = 0.7 + (Math.sin(i * 1.3 + seed) * 0.3 + 0.3);
    return { mes, valor: Math.round(base * variation) };
  });
}

function MetricCard({ label, value, sub, icon: Icon, color, children }: { label: string; value: string; sub?: string; icon: React.ElementType; color: string; children?: React.ReactNode }) {
  const content = (
    <Card className="overflow-hidden cursor-default">
      <CardContent className="p-4 flex items-center gap-4">
        <div className="flex items-center justify-center w-10 h-10 rounded-lg shrink-0" style={{ backgroundColor: color + "22" }}>
          <Icon className="w-5 h-5" style={{ color }} />
        </div>
        <div className="min-w-0">
          <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide truncate">{label}</p>
          <p className="text-xl font-bold leading-tight">{value}</p>
          {sub && <p className="text-xs text-muted-foreground mt-0.5">{sub}</p>}
        </div>
      </CardContent>
    </Card>
  );

  if (children) {
    return (
      <Popover>
        <PopoverTrigger asChild>{content}</PopoverTrigger>
        <PopoverContent className="w-80 p-2">{children}</PopoverContent>
      </Popover>
    );
  }
  return content;
}

export default function AtendimentoProducao() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { unidades, isLoading, error } = useUnidadesData();
  if (isLoading || error) return <UnidadesLoadState loading={isLoading} error={error} />;
  if (!unidades.length) {
    return (
      <AppLayout>
        <div className="p-8 text-center text-muted-foreground">Nenhuma unidade no JSON.</div>
      </AppLayout>
    );
  }
  const unidade = unidades.find(u => u.id === Number(id)) || unidades[0];

  const handleUnitChange = (val: string) => navigate(`/unidade/${val}/atendimento`);

  const atendCol = Math.max(0, unidade.atendimentoTotal - unidade.caixaTotal - unidade.gerenciaTotal);
  const total = unidade.atendimentoTotal || 1;
  const pctAtend = +((atendCol / total) * 100).toFixed(1);
  const pctCaixa = +((unidade.caixaTotal / total) * 100).toFixed(1);
  const pctGerencia = +((unidade.gerenciaTotal / total) * 100).toFixed(1);

  const pieSections = [
    { name: "Atendimento", value: atendCol, pct: pctAtend },
    { name: "Caixa", value: unidade.caixaTotal, pct: pctCaixa },
    { name: "Gerência", value: unidade.gerenciaTotal, pct: pctGerencia },
  ].filter(s => s.value > 0);

  // TME / TMA
  const baseTme = Math.round(8 + (unidade.custoAtendimento / 50) * 4);
  const tmeData = [
    { secao: "Geral", tme: baseTme, tma: Math.round(baseTme * 1.3) },
    { secao: "Atendimento", tme: Math.round(baseTme * 0.9), tma: Math.round(baseTme * 1.1) },
    { secao: "Caixa", tme: Math.round(baseTme * 1.2), tma: Math.round(baseTme * 1.5) },
    { secao: "Gerência", tme: Math.round(baseTme * 0.7), tma: Math.round(baseTme * 0.9) },
  ];

  const avgTme = Math.round(unidades.reduce((s, u) => s + 8 + (u.custoAtendimento / 50) * 4, 0) / unidades.length);
  const avgTma = Math.round(avgTme * 1.3);

  // Monthly data for popovers
  const contratosMes = genMonthlyData(unidade.qtContratos, unidade.id);
  const producaoMes = genMonthlyData(unidade.producaoTotal, unidade.id + 10);
  const producaoVisitaMes = genMonthlyData(unidade.vlProducaoVisita, unidade.id + 20);
  const contratosVisitaMes = genMonthlyData(unidade.qtContratosVisita, unidade.id + 30);

  // Produção
  const producao = [
    { produto: "Consignado", valor: unidade.consignado },
    { produto: "Imobiliário", valor: unidade.imobiliario },
    { produto: "Parcelado PF", valor: unidade.parceladoPf },
    { produto: "Parcelado PJ", valor: unidade.parceladoPj },
    { produto: "Pl. Empresário", valor: unidade.planoEmpresario },
    { produto: "Rotativo PF", valor: unidade.rotativoPf },
    { produto: "Rotativo PJ", valor: unidade.rotativoPj },
    { produto: "Agro", valor: unidade.agro },
  ].filter(p => p.valor > 0);

  const prodTotal = unidade.producaoTotal || 1;
  const taxaConv = parseFloat(unidade.taxaConversao || "0");
  const pctContratosVisita = unidade.qtContratos > 0 ? ((unidade.qtContratosVisita / unidade.qtContratos) * 100).toFixed(1) : "0.0";

  const compactCurrency = (v: number) => {
    if (Math.abs(v) >= 1e9) return `R$ ${(v / 1e9).toFixed(1)}B`;
    if (Math.abs(v) >= 1e6) return `R$ ${(v / 1e6).toFixed(1)}M`;
    if (Math.abs(v) >= 1e3) return `R$ ${(v / 1e3).toFixed(0)}K`;
    return `R$ ${v.toFixed(0)}`;
  };

  function PopoverLineChart({ data, dataKey, title, formatter }: { data: any[]; dataKey: string; title: string; formatter?: (v: number) => string }) {
    return (
      <div className="h-40">
        <p className="text-xs font-semibold text-muted-foreground mb-1">{title}</p>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <XAxis dataKey="mes" tick={{ fontSize: 8 }} />
            <YAxis tick={{ fontSize: 8 }} tickFormatter={formatter} />
            <Tooltip contentStyle={tooltipStyle} formatter={formatter ? (v: number) => formatter(v) : undefined} />
            <Line type="monotone" dataKey={dataKey} stroke="hsl(var(--chart-2))" strokeWidth={2} dot={{ r: 2 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    );
  }

  return (
    <AppLayout>
      <div className="p-6 space-y-6 max-w-[1400px]">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold">Atendimento e Produção</h1>
            <p className="text-sm text-muted-foreground">{unidade.nome} — {unidade.ufRa}</p>
          </div>
          <Select value={String(unidade.id)} onValueChange={handleUnitChange}>
            <SelectTrigger className="w-72"><SelectValue placeholder="Selecionar unidade" /></SelectTrigger>
            <SelectContent className="max-h-64">
              {unidades.map(u => (
                <SelectItem key={u.id} value={String(u.id)}>{u.codigo} — {u.nome}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Atendimento */}
        <div>
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">Atendimento</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <MetricCard label="Atendimentos Totais" value={unidade.atendimentoTotal.toLocaleString("pt-BR")} icon={Users} color="hsl(var(--chart-1))" />
            <MetricCard label="Atendimento" value={atendCol.toLocaleString("pt-BR")} sub={`${pctAtend}% do total`} icon={Activity} color="hsl(var(--chart-2))" />
            <MetricCard label="Caixa" value={unidade.caixaTotal.toLocaleString("pt-BR")} sub={`${pctCaixa}% do total`} icon={Landmark} color="hsl(var(--chart-3))" />
            <MetricCard label="Gerência" value={unidade.gerenciaTotal.toLocaleString("pt-BR")} sub={`${pctGerencia}% do total`} icon={Briefcase} color="hsl(var(--chart-4))" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* TME / TMA as Line Chart */}
            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-sm">TME e TMA (min) por Seção</CardTitle></CardHeader>
              <CardContent>
                <div className="h-60">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={tmeData}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                      <XAxis dataKey="secao" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }} />
                      <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }} />
                      <Tooltip contentStyle={tooltipStyle} />
                      <Legend wrapperStyle={{ fontSize: 11 }} />
                      <ReferenceLine y={avgTme} stroke="hsl(var(--chart-1))" strokeDasharray="5 5" label={{ value: `Média TME: ${avgTme}`, fill: "hsl(var(--muted-foreground))", fontSize: 9, position: "insideTopLeft" }} />
                      <ReferenceLine y={avgTma} stroke="hsl(var(--chart-3))" strokeDasharray="5 5" label={{ value: `Média TMA: ${avgTma}`, fill: "hsl(var(--muted-foreground))", fontSize: 9, position: "insideBottomLeft" }} />
                      <Line type="monotone" dataKey="tme" name="TME" stroke="hsl(var(--chart-1))" strokeWidth={2} dot={{ r: 4 }} />
                      <Line type="monotone" dataKey="tma" name="TMA" stroke="hsl(var(--chart-3))" strokeWidth={2} dot={{ r: 4 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Distribuição Pie */}
            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-sm">Distribuição por Seção</CardTitle></CardHeader>
              <CardContent>
                <div className="h-60">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={pieSections} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={85} label={({ name, pct }) => `${name}: ${pct}%`} fontSize={10}>
                        {pieSections.map((_, i) => <Cell key={i} fill={COLORS[(i + 1) % COLORS.length]} />)}
                      </Pie>
                      <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => v.toLocaleString("pt-BR")} />
                      <Legend wrapperStyle={{ fontSize: 11 }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Produção */}
        <div>
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">Produção</h2>

          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
            <MetricCard label="Produção Total" value={compactCurrency(unidade.producaoTotal)} icon={Activity} color="hsl(var(--chart-1))">
              <PopoverLineChart data={producaoMes} dataKey="valor" title="Produção Mês a Mês" formatter={compactCurrency} />
            </MetricCard>
            <MetricCard label="Contratos" value={unidade.qtContratos.toLocaleString("pt-BR")} icon={Briefcase} color="hsl(var(--chart-2))">
              <PopoverLineChart data={contratosMes} dataKey="valor" title="Contratos Mês a Mês" />
            </MetricCard>
            <MetricCard label="Taxa Conversão" value={`${taxaConv.toFixed(2)}%`} icon={TrendingUp} color="hsl(var(--chart-3))" />
            <MetricCard label="Produção Pós Visita" value={compactCurrency(unidade.vlProducaoVisita)} icon={Activity} color="hsl(var(--chart-4))">
              <PopoverLineChart data={producaoVisitaMes} dataKey="valor" title="Produção Pós Visita Mês a Mês" formatter={compactCurrency} />
            </MetricCard>
            <MetricCard
              label="Contratos Pós Visita"
              value={unidade.qtContratosVisita.toLocaleString("pt-BR")}
              sub={`${pctContratosVisita}% do total`}
              icon={Briefcase}
              color="hsl(var(--chart-5))"
            >
              <PopoverLineChart data={contratosVisitaMes} dataKey="valor" title="Contratos Pós Visita Mês a Mês" />
            </MetricCard>
          </div>

          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm">Produção por Produto</CardTitle></CardHeader>
            <CardContent>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={producao} layout="vertical" margin={{ left: 10, right: 40 }}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                    <XAxis type="number" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }} tickFormatter={(v) => compactCurrency(v)} />
                    <YAxis dataKey="produto" type="category" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }} width={95} />
                    <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => [formatCurrency(v), "Valor"]} />
                    <Bar dataKey="valor" fill="hsl(var(--chart-2))" radius={[0, 4, 4, 0]} label={{ position: "right", fill: "hsl(var(--muted-foreground))", fontSize: 9, formatter: (v: number) => `${((v / prodTotal) * 100).toFixed(1)}%` }} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
