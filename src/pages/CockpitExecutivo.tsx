import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AppLayout } from "@/components/layout/AppLayout";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatCurrency, formatPercent } from "@/lib/mock-data";
import { useUnidadesData } from "@/hooks/use-unidades";
import { UnidadesLoadState } from "@/components/UnidadesLoadState";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell, PieChart, Pie, RadialBarChart, RadialBar, Legend } from "recharts";
import { TrendingUp, TrendingDown, DollarSign, Activity, Target, Monitor, Users, Building2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

function MetricCard({ title, value, subtitle, icon: Icon, trend, accent }: {
  title: string; value: string; subtitle?: string; icon: any; trend?: "up" | "down"; accent?: string;
}) {
  return (
    <Card className="relative overflow-hidden group hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <div className={`flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-xl ${accent || "bg-primary/10"}`}>
            <Icon className={`w-5 h-5 ${accent ? "text-primary-foreground" : "text-primary"}`} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider truncate">{title}</p>
            <p className="text-lg font-bold leading-tight truncate">{value}</p>
            {subtitle && (
              <p className={`text-[10px] mt-0.5 flex items-center gap-1 ${trend === "up" ? "text-success" : trend === "down" ? "text-destructive" : "text-muted-foreground"}`}>
                {trend === "up" && <TrendingUp className="w-3 h-3 flex-shrink-0" />}
                {trend === "down" && <TrendingDown className="w-3 h-3 flex-shrink-0" />}
                <span className="truncate">{subtitle}</span>
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function compactCurrency(v: number): string {
  const abs = Math.abs(v);
  const sign = v < 0 ? "-" : "";
  if (abs >= 1e9) return `${sign}R$ ${(abs / 1e9).toFixed(1)}B`;
  if (abs >= 1e6) return `${sign}R$ ${(abs / 1e6).toFixed(1)}M`;
  if (abs >= 1e3) return `${sign}R$ ${(abs / 1e3).toFixed(0)}K`;
  return `${sign}R$ ${abs.toFixed(0)}`;
}

export default function CockpitExecutivo() {
  const navigate = useNavigate();
  const { unidades, UFS, UF_RAS, isLoading, error } = useUnidadesData();
  const [uf, setUf] = useState("todas");
  const [ufRa, setUfRa] = useState("todas");

  const filtered = useMemo(() => {
    return unidades.filter(u => {
      if (uf !== "todas" && u.uf !== uf) return false;
      if (ufRa !== "todas" && u.ufRa !== ufRa) return false;
      return true;
    });
  }, [uf, ufRa, unidades]);

  const n = filtered.length || 1;
  const totalResultado = filtered.reduce((s, u) => s + u.resultado, 0);
  const totalResultadoComDG = filtered.reduce((s, u) => s + u.resultadoComDG, 0);
  const totalRla = filtered.reduce((s, u) => s + u.rla, 0);
  const totalDespAdm = filtered.reduce((s, u) => s + u.despAdmTotal, 0);
  const mediaOcupacao = filtered.reduce((s, u) => s + u.custoOcupacao, 0) / n;
  const mediaDEA = filtered.reduce((s, u) => s + u.dea, 0) / n;
  const mediaReceitaColab = filtered.reduce((s, u) => s + u.receitaColab, 0) / n;
  const mediaCustoAtend = filtered.reduce((s, u) => s + u.custoAtendimento, 0) / n;
  const totalClientes = filtered.reduce((s, u) => s + u.clientes, 0);
  const totalProducao = filtered.reduce((s, u) => s + u.producaoTotal, 0);
  const mediaMetasPct = filtered.reduce((s, u) => s + u.metasMedia, 0) / n;

  const deaDistribution = useMemo(() => {
    const faixas = [
      { faixa: "< 3", min: 0, max: 3, color: "hsl(var(--destructive))" },
      { faixa: "3-5", min: 3, max: 5, color: "hsl(var(--warning))" },
      { faixa: "5-8", min: 5, max: 8, color: "hsl(var(--chart-1))" },
      { faixa: "8-12", min: 8, max: 12, color: "hsl(var(--chart-2))" },
      { faixa: "12-20", min: 12, max: 20, color: "hsl(var(--success))" },
      { faixa: "> 20", min: 20, max: Infinity, color: "hsl(var(--chart-5))" },
    ];
    return faixas.map(f => ({
      faixa: f.faixa,
      qtd: filtered.filter(u => u.dea >= f.min && u.dea < f.max).length,
      color: f.color,
    }));
  }, [filtered]);

  const topResult = [...filtered].sort((a, b) => b.resultado - a.resultado).slice(0, 10);
  const bottomResult = [...filtered].sort((a, b) => a.resultado - b.resultado).slice(0, 10);

  const topChartData = topResult.map(u => ({ nome: u.nome.length > 18 ? u.nome.slice(0, 18) + "…" : u.nome, valor: u.resultado, id: u.id }));
  const bottomChartData = bottomResult.map(u => ({ nome: u.nome.length > 18 ? u.nome.slice(0, 18) + "…" : u.nome, valor: u.resultado, id: u.id }));

  const resultadoPie = useMemo(() => {
    const positivas = filtered.filter(u => u.resultado >= 0).length;
    const negativas = filtered.length - positivas;
    return [
      { name: "Positivo", value: positivas, color: "hsl(var(--success))" },
      { name: "Negativo", value: negativas, color: "hsl(var(--destructive))" },
    ];
  }, [filtered]);

  const metasGauge = useMemo(() => [
    { name: "Metas", value: Math.min(mediaMetasPct, 150), fill: mediaMetasPct >= 100 ? "hsl(var(--success))" : "hsl(var(--warning))" },
  ], [mediaMetasPct]);

  if (isLoading || error) return <UnidadesLoadState loading={isLoading} error={error} />;

  return (
    <AppLayout>
      <div className="p-4 md:p-6 space-y-5 max-w-[1400px]">
        {/* Header */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-xl font-bold tracking-tight">Cockpit Executivo</h1>
            <p className="text-xs text-muted-foreground">{filtered.length} unidades selecionadas</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Select value={uf} onValueChange={v => { setUf(v); setUfRa("todas"); }}>
              <SelectTrigger className="w-[110px] h-8 text-xs"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="todas">Todas UFs</SelectItem>
                {UFS.map(u => <SelectItem key={u} value={u}>{u}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={ufRa} onValueChange={setUfRa}>
              <SelectTrigger className="w-[160px] h-8 text-xs"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="todas">Todas regiões</SelectItem>
                {UF_RAS.filter(r => uf === "todas" || r.startsWith(uf)).map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* KPI Cards - Row 1 */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          <MetricCard title="Resultado" value={compactCurrency(totalResultado)} subtitle={totalResultado >= 0 ? "Positivo" : "Negativo"} icon={DollarSign} trend={totalResultado >= 0 ? "up" : "down"} />
          <MetricCard title="Resultado c/ DG" value={compactCurrency(totalResultadoComDG)} icon={DollarSign} />
          <MetricCard title="RLA" value={compactCurrency(totalRla)} icon={TrendingUp} trend="up" />
          <MetricCard title="Desp. Adm." value={compactCurrency(totalDespAdm)} icon={TrendingDown} />
          <MetricCard title="Ocupação Média" value={formatPercent(mediaOcupacao)} icon={Building2} />
          <MetricCard title="Clientes" value={(totalClientes / 1000).toFixed(0) + "K"} subtitle={`${filtered.length} unidades`} icon={Users} />
        </div>

        {/* KPI Cards - Row 2 */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          <MetricCard title="DEA Médio" value={mediaDEA.toFixed(1)} icon={Activity} />
          <MetricCard title="Receita/Colab." value={compactCurrency(mediaReceitaColab)} icon={DollarSign} />
          <MetricCard title="Custo/Atend." value={`R$ ${mediaCustoAtend.toFixed(0)}`} icon={Target} />
          <MetricCard title="Produção" value={compactCurrency(totalProducao)} icon={TrendingUp} />
          <MetricCard title="Metas" value={formatPercent(mediaMetasPct)} icon={Activity} subtitle={mediaMetasPct >= 100 ? "Atingida" : "Abaixo"} trend={mediaMetasPct >= 100 ? "up" : "down"} />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* DEA Distribution */}
          <Card>
            <CardHeader className="pb-1 pt-4 px-4">
              <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Distribuição DEA</CardTitle>
            </CardHeader>
            <CardContent className="px-2 pb-3">
              <div className="h-52">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={deaDistribution} layout="vertical" margin={{ left: 4, right: 12 }}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" horizontal={false} />
                    <XAxis type="number" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }} />
                    <YAxis dataKey="faixa" type="category" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }} width={36} />
                    <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 11 }} />
                    <Bar dataKey="qtd" radius={[0, 4, 4, 0]} name="Unidades">
                      {deaDistribution.map((entry, i) => (
                        <Cell key={i} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Resultado Split Pie */}
          <Card>
            <CardHeader className="pb-1 pt-4 px-4">
              <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Resultado por Unidade</CardTitle>
            </CardHeader>
            <CardContent className="px-2 pb-3 flex items-center justify-center">
              <div className="h-52 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={resultadoPie} dataKey="value" cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={4} strokeWidth={0}>
                      {resultadoPie.map((entry, i) => (
                        <Cell key={i} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 11 }} />
                    <Legend iconType="circle" wrapperStyle={{ fontSize: 11 }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Metas Gauge */}
          <Card>
            <CardHeader className="pb-1 pt-4 px-4">
              <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Atingimento de Metas</CardTitle>
            </CardHeader>
            <CardContent className="px-2 pb-3 flex flex-col items-center justify-center">
              <div className="h-52 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <RadialBarChart cx="50%" cy="50%" innerRadius="60%" outerRadius="90%" data={metasGauge} startAngle={180} endAngle={0}>
                    <RadialBar dataKey="value" cornerRadius={8} background={{ fill: "hsl(var(--muted))" }} />
                  </RadialBarChart>
                </ResponsiveContainer>
              </div>
              <p className="text-2xl font-bold -mt-16">{formatPercent(mediaMetasPct)}</p>
              <p className="text-[10px] text-muted-foreground mt-1">Média da rede</p>
            </CardContent>
          </Card>
        </div>

        {/* Ranking Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card>
            <CardHeader className="pb-1 pt-4 px-4">
              <CardTitle className="text-xs font-semibold uppercase tracking-wider text-success">Top 10 Resultado</CardTitle>
            </CardHeader>
            <CardContent className="px-1 pb-3">
              <div className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={topChartData} layout="vertical" margin={{ left: 8, right: 12 }}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" horizontal={false} />
                    <XAxis type="number" tickFormatter={v => compactCurrency(v)} tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 9 }} />
                    <YAxis dataKey="nome" type="category" tick={{ fill: "hsl(var(--foreground))", fontSize: 9 }} width={110} />
                    <Tooltip formatter={(v: number) => formatCurrency(v)} contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 11 }} />
                    <Bar dataKey="valor" fill="hsl(var(--success))" radius={[0, 4, 4, 0]} name="Resultado" cursor="pointer" onClick={(d: any) => navigate(`/unidade/${d.id}`)} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-1 pt-4 px-4">
              <CardTitle className="text-xs font-semibold uppercase tracking-wider text-destructive">Bottom 10 Resultado</CardTitle>
            </CardHeader>
            <CardContent className="px-1 pb-3">
              <div className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={bottomChartData} layout="vertical" margin={{ left: 8, right: 12 }}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" horizontal={false} />
                    <XAxis type="number" tickFormatter={v => compactCurrency(v)} tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 9 }} />
                    <YAxis dataKey="nome" type="category" tick={{ fill: "hsl(var(--foreground))", fontSize: 9 }} width={110} />
                    <Tooltip formatter={(v: number) => formatCurrency(v)} contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 11 }} />
                    <Bar dataKey="valor" fill="hsl(var(--destructive))" radius={[0, 4, 4, 0]} name="Resultado" cursor="pointer" onClick={(d: any) => navigate(`/unidade/${d.id}`)} />
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
