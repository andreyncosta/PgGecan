import { useParams } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/mock-data";
import { useUnidadesData } from "@/hooks/use-unidades";
import { UnidadesLoadState } from "@/components/UnidadesLoadState";
import { MapPin, Users, DollarSign, Building2, Navigation } from "lucide-react";

export default function Territorial() {
  const { id } = useParams();
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

  // Unidades próximas (mesma RA)
  const mesmaRA = unidades.filter(u => u.ra === unidade.ra && u.id !== unidade.id);

  return (
    <AppLayout>
      <div className="p-6 space-y-6 max-w-[1400px]">
        <div>
          <h1 className="text-2xl font-bold">Análise Territorial</h1>
          <p className="text-sm text-muted-foreground">{unidade.nome} — {unidade.ufRa}</p>
        </div>

        {/* Mapa simulado */}
        <Card>
          <CardContent className="p-6">
            <div className="relative w-full h-[400px] bg-muted/30 rounded-lg border border-border overflow-hidden">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full border-2 border-dashed border-primary/30" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full border-2 border-dashed border-primary/15" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                  <MapPin className="w-3 h-3 text-primary-foreground" />
                </div>
                <span className="text-[10px] font-medium mt-1 bg-card px-1.5 py-0.5 rounded text-foreground shadow-sm">{unidade.nome}</span>
              </div>
              <span className="absolute top-1/2 left-1/2 translate-x-16 -translate-y-28 text-[10px] text-primary/60 font-medium">3km</span>
              <span className="absolute top-1/2 left-1/2 translate-x-32 -translate-y-44 text-[10px] text-primary/40 font-medium">5km</span>

              {mesmaRA.slice(0, 6).map((u, i) => {
                const angles = [30, 75, 150, 210, 280, 330];
                const r = 25 + (i % 3) * 10;
                const x = 50 + r * Math.cos((angles[i] * Math.PI) / 180);
                const y = 50 + r * Math.sin((angles[i] * Math.PI) / 180);
                return (
                  <div key={u.id} className="absolute group" style={{ left: `${x}%`, top: `${y}%`, transform: "translate(-50%, -50%)" }}>
                    <div className="w-2.5 h-2.5 rounded-full bg-warning/70" />
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 hidden group-hover:block z-10">
                      <div className="bg-card border border-border rounded px-2 py-1 text-[10px] whitespace-nowrap shadow">{u.nome}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Clientes", value: unidade.clientes.toLocaleString("pt-BR"), icon: Users },
            { label: "Região", value: unidade.ufRa, icon: MapPin },
            { label: "Unidades na mesma RA", value: String(mesmaRA.length), icon: Building2 },
            { label: "Resultado Líquido", value: formatCurrency(unidade.resultado), icon: DollarSign },
          ].map(m => (
            <Card key={m.label}>
              <CardContent className="p-4 flex items-start justify-between">
                <div>
                  <p className="text-[10px] font-medium text-muted-foreground uppercase">{m.label}</p>
                  <p className="text-xl font-bold mt-1">{m.value}</p>
                </div>
                <m.icon className="w-4 h-4 text-muted-foreground" />
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Unidades na mesma região */}
        {mesmaRA.length > 0 && (
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm">Unidades na mesma RA ({unidade.ra})</CardTitle></CardHeader>
            <CardContent className="p-0 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">Unidade</th>
                    <th className="px-4 py-3 text-right font-medium text-muted-foreground">Resultado</th>
                    <th className="px-4 py-3 text-right font-medium text-muted-foreground">Clientes</th>
                    <th className="px-4 py-3 text-right font-medium text-muted-foreground">DEA</th>
                  </tr>
                </thead>
                <tbody>
                  {mesmaRA.map(u => (
                    <tr key={u.id} className="border-b border-border">
                      <td className="px-4 py-3 font-medium">{u.nome}</td>
                      <td className="px-4 py-3 text-right font-mono">{formatCurrency(u.resultado)}</td>
                      <td className="px-4 py-3 text-right font-mono">{u.clientes.toLocaleString("pt-BR")}</td>
                      <td className="px-4 py-3 text-right font-mono">{u.dea.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        )}
      </div>
    </AppLayout>
  );
}
