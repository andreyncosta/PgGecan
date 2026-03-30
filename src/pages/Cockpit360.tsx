import { useParams, useNavigate } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatCurrency, formatPercent, type Unidade } from "@/lib/mock-data";
import { useUnidadesData } from "@/hooks/use-unidades";
import { UnidadesLoadState } from "@/components/UnidadesLoadState";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import { Building2, TrendingUp, TrendingDown, Users, Monitor, Target, Smartphone } from "lucide-react";

const COLORS = ["hsl(var(--chart-1))", "hsl(var(--chart-2))", "hsl(var(--chart-3))", "hsl(var(--chart-4))", "hsl(var(--chart-5))"];

function compactCurrency(v: number): string {
  const abs = Math.abs(v);
  const sign = v < 0 ? "-" : "";
  if (abs >= 1e9) return `${sign}R$ ${(abs / 1e9).toFixed(1)}B`;
  if (abs >= 1e6) return `${sign}R$ ${(abs / 1e6).toFixed(1)}M`;
  if (abs >= 1e3) return `${sign}R$ ${(abs / 1e3).toFixed(0)}K`;
  return `${sign}R$ ${abs.toFixed(0)}`;
}

export default function Cockpit360() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { unidades, isLoading, error } = useUnidadesData();
  if (isLoading || error) return <UnidadesLoadState loading={isLoading} error={error} />;
  if (!unidades.length) {
    return (
      <AppLayout>
        <div className="p-8 text-center text-muted-foreground">Nenhuma unidade no arquivo JSON.</div>
      </AppLayout>
    );
  }

  function getRanking(unidadeId: number, metric: keyof Unidade, desc = true): number {
    const sorted = [...unidades].sort((a, b) => desc ? (b[metric] as number) - (a[metric] as number) : (a[metric] as number) - (b[metric] as number));
    return sorted.findIndex(u => u.id === unidadeId) + 1;
  }

  function bankAvg(metric: keyof Unidade): number {
    return unidades.reduce((s, u) => s + (u[metric] as number), 0) / unidades.length;
  }

  const unidade = unidades.find(u => u.id === Number(id)) || unidades[0];
  const total = unidades.length;

  const cluster = unidades.filter(u => u.ufRa === unidade.ufRa);
  const cn = cluster.length || 1;
  const clusterAvg = {
    dea: cluster.reduce((s, u) => s + u.dea, 0) / cn,
    receitaColab: cluster.reduce((s, u) => s + u.receitaColab, 0) / cn,
    custoAtendimento: cluster.reduce((s, u) => s + u.custoAtendimento, 0) / cn,
  };

  const comparativo = [
    { label: "DEA", unidade: unidade.dea, cluster: +clusterAvg.dea.toFixed(2) },
    { label: "Rec/Colab (mil)", unidade: +(unidade.receitaColab / 1000).toFixed(0), cluster: +(clusterAvg.receitaColab / 1000).toFixed(0) },
    { label: "Custo/Atend", unidade: unidade.custoAtendimento, cluster: +clusterAvg.custoAtendimento.toFixed(2) },
  ];

  const totalClientes = unidade.clientes;
  const clientesDigitais = Math.round(totalClientes * (0.3 + (unidade.id % 10) * 0.04));
  const pctDigitais = totalClientes > 0 ? ((clientesDigitais / totalClientes) * 100).toFixed(1) : "0.0";

  const segmentacao = [
    { name: "Alta", value: unidade.altaMa },
    { name: "Média Alta", value: unidade.mediaAltaMa },
    { name: "Média", value: unidade.mediaMa },
    { name: "Baixa", value: unidade.baixaMa },
    { name: "Empresas", value: unidade.empresas + unidade.empresarial + unidade.empreendedor },
  ].filter(s => s.value > 0);

  const segTotal = segmentacao.reduce((s, v) => s + v.value, 0) || 1;

  const metas = [
    { periodo: "1S24", valor: unidade.metas1s24 },
    { periodo: "2S24", valor: unidade.metas2s24 },
    { periodo: "1S25", valor: unidade.metas1s25 },
    { periodo: "2S25", valor: unidade.metas2s25 },
  ];

  // Resultado cards — removed "Resultado c/ DG" and "Custo Ocupação"
  const resultadoCards = [
    { label: "Resultado Líquido", value: compactCurrency(unidade.resultado), rank: getRanking(unidade.id, "resultado") },
    { label: "RLA", value: compactCurrency(unidade.rla), rank: getRanking(unidade.id, "rla") },
    { label: "Desp. Administrativas", value: compactCurrency(unidade.despAdmTotal), rank: getRanking(unidade.id, "despAdmTotal", false) },
    { label: "Clientes", value: unidade.clientes.toLocaleString("pt-BR"), rank: getRanking(unidade.id, "clientes") },
  ];

  const eficienciaCards = [
    { label: "DEA", value: unidade.dea.toFixed(2), avg: bankAvg("dea"), raw: unidade.dea, lower: true },
    { label: "Receita/Colab", value: compactCurrency(unidade.receitaColab), avg: bankAvg("receitaColab"), raw: unidade.receitaColab, lower: false },
    { label: "Custo/Atend", value: `R$ ${unidade.custoAtendimento.toFixed(2)}`, avg: bankAvg("custoAtendimento"), raw: unidade.custoAtendimento, lower: true },
    { label: "Produção Total", value: compactCurrency(unidade.producaoTotal), avg: bankAvg("producaoTotal"), raw: unidade.producaoTotal, lower: false },
    { label: "Metas (Média)", value: formatPercent(unidade.metasMedia), avg: bankAvg("metasMedia"), raw: unidade.metasMedia, lower: false },
  ];

  // Atendimento cards with ranking
  const atendCol = Math.max(0, unidade.atendimentoTotal - unidade.caixaTotal - unidade.gerenciaTotal);
  const atendCards = [
    { label: "Atendimentos Total", value: unidade.atendimentoTotal.toLocaleString("pt-BR"), rank: getRanking(unidade.id, "atendimentoTotal"), icon: Users },
    { label: "Atend. Caixa", value: unidade.caixaTotal.toLocaleString("pt-BR"), rank: getRanking(unidade.id, "caixaTotal"), icon: Monitor },
    { label: "Atend. Gerência", value: unidade.gerenciaTotal.toLocaleString("pt-BR"), rank: getRanking(unidade.id, "gerenciaTotal"), icon: Building2 },
    { label: "Atendimento", value: atendCol.toLocaleString("pt-BR"), rank: getRanking(unidade.id, "atendimentoCol"), icon: Users },
  ];

  function rankSuffix(r: number): string {
    return `${r}º/${total}`;
  }

  return (
    <AppLayout>
      <div className="p-6 space-y-6 max-w-[1400px]">
        {/* Header + Unit Selector */}
        <div className="flex items-start gap-4 flex-wrap">
          <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10">
            <Building2 className="w-6 h-6 text-primary" />
          </div>
          <div className="flex-1 min-w-[200px]">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl font-bold">Cockpit 360°</h1>
              <Select value={String(unidade.id)} onValueChange={(v) => navigate(`/unidade/${v}`)}>
                <SelectTrigger className="w-[280px] h-9 text-sm"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {unidades.map(u => (
                    <SelectItem key={u.id} value={String(u.id)}>{u.codigo} — {u.nome}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-wrap gap-4 mt-1 text-xs text-muted-foreground">
              <span>UF: {unidade.uf}</span>
              <span>Região: {unidade.ufRa}</span>
              <span>Inauguração: {unidade.dataAbertura}</span>
              <span>Gerentes: {unidade.gerentes}</span>
              {unidade.novoModelo === "Sim" && <span>✅ Novo Modelo</span>}
            </div>
          </div>
        </div>

        {/* Resultado Econômico */}
        <div>
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">Resultado Econômico</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {resultadoCards.map(m => (
              <Card key={m.label}>
                <CardContent className="p-3">
                  <p className="text-[10px] font-medium text-muted-foreground uppercase truncate">{m.label}</p>
                  <p className="text-lg font-bold mt-1 truncate">{m.value}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5 flex items-center gap-1">
                    <Target className="w-3 h-3" />{rankSuffix(m.rank)}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Clientes + Digitais */}
        <div className="grid grid-cols-2 lg:grid-cols-2 gap-3">
          <Card>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg shrink-0 bg-primary/10">
                <Users className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-[10px] font-semibold text-muted-foreground uppercase">Clientes Total</p>
                <p className="text-xl font-bold">{unidade.clientes.toLocaleString("pt-BR")}</p>
                <p className="text-[10px] text-muted-foreground flex items-center gap-1"><Target className="w-3 h-3" />{rankSuffix(getRanking(unidade.id, "clientes"))}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg shrink-0" style={{ backgroundColor: "hsl(var(--chart-2) / 0.15)" }}>
                <Smartphone className="w-5 h-5" style={{ color: "hsl(var(--chart-2))" }} />
              </div>
              <div>
                <p className="text-[10px] font-semibold text-muted-foreground uppercase">Clientes Digitais</p>
                <p className="text-xl font-bold">{clientesDigitais.toLocaleString("pt-BR")}</p>
                <p className="text-xs text-muted-foreground">{pctDigitais}% do total</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Eficiência */}
        <div>
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">Eficiência</h2>
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
            {eficienciaCards.map(m => {
              const aboveAvg = m.lower ? m.raw < m.avg : m.raw > m.avg;
              return (
                <Card key={m.label}>
                  <CardContent className="p-3">
                    <p className="text-[10px] font-medium text-muted-foreground uppercase truncate">{m.label}</p>
                    <p className="text-lg font-bold mt-1 truncate">{m.value}</p>
                    <div className={`text-[10px] mt-0.5 flex items-center gap-1 ${aboveAvg ? "text-emerald-500" : "text-red-500"}`}>
                      {aboveAvg ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                      {aboveAvg ? "Acima" : "Abaixo"} da média
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Comparativo + Metas */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm">Unidade × Cluster ({unidade.ufRa})</CardTitle></CardHeader>
            <CardContent>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={comparativo} barGap={4}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                    <XAxis dataKey="label" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }} />
                    <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }} />
                    <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }} />
                    <Bar dataKey="unidade" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} name="Unidade" />
                    <Bar dataKey="cluster" fill="hsl(var(--muted-foreground))" radius={[4, 4, 0, 0]} name="Cluster" opacity={0.4} />
                    <Legend wrapperStyle={{ fontSize: 10 }} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm">Metas por Semestre</CardTitle></CardHeader>
            <CardContent>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={metas}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                    <XAxis dataKey="periodo" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} />
                    <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }} domain={[0, 'auto']} />
                    <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }} formatter={(v: number) => `${v.toFixed(1)}%`} />
                    <Bar dataKey="valor" name="Meta %" radius={[4, 4, 0, 0]}>
                      {metas.map((m, i) => (
                        <Cell key={i} fill={m.valor >= 100 ? "hsl(142 76% 36%)" : m.valor >= 90 ? "hsl(38 92% 50%)" : "hsl(var(--destructive))"} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Atendimento & Segmentação */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">Atendimento</h2>
            <div className="grid grid-cols-2 gap-3">
              {atendCards.map(m => (
                <Card key={m.label}>
                  <CardContent className="p-3 flex items-start justify-between">
                    <div>
                      <p className="text-[10px] font-medium text-muted-foreground uppercase">{m.label}</p>
                      <p className="text-lg font-bold mt-1">{m.value}</p>
                      <p className="text-[10px] text-muted-foreground flex items-center gap-1"><Target className="w-3 h-3" />{rankSuffix(m.rank)}</p>
                    </div>
                    <m.icon className="w-4 h-4 text-muted-foreground" />
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">Segmentação de Clientes</h2>
            <Card>
              <CardContent className="pt-6">
                <div className="h-52">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={segmentacao} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label={({ name, value }) => `${name}: ${value.toLocaleString("pt-BR")}`} fontSize={10}>
                        {segmentacao.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                      </Pie>
                      <Tooltip
                        contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }}
                        formatter={(value: number, name: string) => [`${value.toLocaleString("pt-BR")} (${((value / segTotal) * 100).toFixed(1)}%)`, name]}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
