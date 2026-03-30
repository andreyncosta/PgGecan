import { useParams, useNavigate } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatCurrency } from "@/lib/mock-data";
import { useUnidadesData } from "@/hooks/use-unidades";
import { UnidadesLoadState } from "@/components/UnidadesLoadState";
import { Building2, Calendar, DollarSign, ShieldCheck, CheckCircle2, XCircle, Image, Users, MapPin, Ruler, Clock, Landmark } from "lucide-react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";

const COLORS = ["hsl(var(--chart-1))", "hsl(var(--chart-2))", "hsl(var(--chart-3))", "hsl(var(--chart-4))", "hsl(var(--chart-5))", "hsl(var(--muted-foreground))"];

const tooltipStyle = {
  backgroundColor: "hsl(var(--card))",
  border: "1px solid hsl(var(--border))",
  borderRadius: 8,
  fontSize: 12,
};

export default function EstruturaGovernanca() {
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

  const isEncerramento = unidade.encerramento === "SIM";
  const isNovoModelo = unidade.novoModelo === "Sim";

  const quadroPessoal = [
    { cargo: "Escriturário", qtd: unidade.escriturarios },
    { cargo: "Gerente de Negócio", qtd: unidade.gerenteNegocio },
    { cargo: "Gerente de Expediente", qtd: unidade.gerenteExpediente },
    { cargo: "Gerente Geral", qtd: unidade.gerenteGeral },
    { cargo: "Caixa Bancário", qtd: unidade.caixaBancario },
    { cargo: "Demais Cargos", qtd: unidade.demaisCargos },
  ].filter(c => c.qtd > 0);

  const totalFuncionarios = quadroPessoal.reduce((s, c) => s + c.qtd, 0);

  return (
    <AppLayout>
      <div className="p-6 space-y-6 max-w-[1400px]">
        {/* Header + Unit Selector */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold">Estrutura e Governança</h1>
            <p className="text-sm text-muted-foreground">{unidade.nome} — {unidade.ufRa}</p>
          </div>
          <Select value={String(unidade.id)} onValueChange={(v) => navigate(`/unidade/${v}/estrutura`)}>
            <SelectTrigger className="w-72">
              <SelectValue placeholder="Selecionar unidade" />
            </SelectTrigger>
            <SelectContent className="max-h-64">
              {unidades.map(u => (
                <SelectItem key={u.id} value={String(u.id)}>
                  {u.codigo} — {u.nome}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Dados da Unidade */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Building2 className="w-4 h-4 text-primary" />
                Dados da Unidade
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { label: "Código", value: unidade.codigo },
                { label: "Tipologia", value: unidade.tipologia },
                { label: "Superintendência", value: unidade.superintendencia },
                { label: "UF / Região", value: unidade.ufRa },
                { label: "Endereço", value: unidade.endereco, icon: MapPin },
                { label: "Metragem (m²)", value: `${unidade.metragemQuadrada} m²`, icon: Ruler },
                { label: "Porte", value: `${unidade.porte} / 5` },
                { label: "Inauguração", value: unidade.dataAbertura, icon: Calendar },
                { label: "Horário", value: unidade.horarioFuncionamento, icon: Clock },
                { label: "Dentro de Órgão?", value: unidade.dentroOrgao ? "Sim" : "Não", icon: Landmark },
              ].map(item => (
                <div key={item.label} className="flex items-center justify-between py-1.5 border-b border-border last:border-0">
                  <span className="text-xs text-muted-foreground">{item.label}</span>
                  <span className="text-sm font-semibold">{item.value}</span>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Status e Governança */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-primary" />
                Status e Governança
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Novo Modelo?</span>
                {isNovoModelo ? (
                  <Badge className="bg-success/10 text-success border-success/20 gap-1"><CheckCircle2 className="w-3 h-3" /> Sim</Badge>
                ) : (
                  <Badge variant="secondary" className="gap-1">Não</Badge>
                )}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Encerramento?</span>
                {isEncerramento ? (
                  <Badge variant="destructive" className="gap-1"><XCircle className="w-3 h-3" /> Sim</Badge>
                ) : (
                  <Badge variant="secondary" className="gap-1">Não</Badge>
                )}
              </div>
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div>
                  <p className="text-xs text-muted-foreground">DEA Score</p>
                  <p className="text-2xl font-bold">{unidade.dea.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Metas (Média)</p>
                  <p className={`text-2xl font-bold ${unidade.metasMedia >= 100 ? "text-success" : unidade.metasMedia >= 90 ? "text-warning" : "text-destructive"}`}>
                    {unidade.metasMedia.toFixed(1)}%
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground">Aluguéis</p>
                  <p className="text-lg font-bold">{formatCurrency(Math.abs(unidade.alugueis))}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Custo Ocupação</p>
                  <p className="text-lg font-bold">{unidade.custoOcupacao.toFixed(1)}%</p>
                </div>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Desp. Administrativas</p>
                <p className="text-lg font-bold">{formatCurrency(Math.abs(unidade.despAdmTotal))}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quadro de Pessoal */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Users className="w-4 h-4 text-primary" />
                Quadro de Pessoal — {totalFuncionarios} funcionários
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {quadroPessoal.map(c => (
                  <div key={c.cargo} className="flex items-center justify-between py-1.5 border-b border-border last:border-0">
                    <span className="text-sm text-muted-foreground">{c.cargo}</span>
                    <div className="flex items-center gap-3">
                      <div className="w-24 h-2 rounded-full bg-muted overflow-hidden">
                        <div className="h-full rounded-full bg-primary" style={{ width: `${(c.qtd / totalFuncionarios) * 100}%` }} />
                      </div>
                      <span className="text-sm font-bold w-8 text-right">{c.qtd}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Users className="w-4 h-4 text-primary" />
                Distribuição por Cargo
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={quadroPessoal}
                      dataKey="qtd"
                      nameKey="cargo"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label={({ cargo, qtd }) => `${cargo}: ${qtd}`}
                      fontSize={10}
                    >
                      {quadroPessoal.map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={tooltipStyle} />
                    <Legend wrapperStyle={{ fontSize: 10 }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Imagens */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Image className="w-4 h-4 text-primary" />
              Registro Fotográfico
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              {["Fachada", "Interior"].map(label => (
                <div key={label} className="aspect-video bg-muted rounded-lg flex items-center justify-center border border-border">
                  <div className="text-center text-muted-foreground">
                    <Image className="w-8 h-8 mx-auto mb-2 opacity-30" />
                    <p className="text-xs">{label}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
