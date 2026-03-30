import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent } from "@/components/ui/card";
import { useUnidadesData } from "@/hooks/use-unidades";
import { UnidadesLoadState } from "@/components/UnidadesLoadState";
import { MapPin } from "lucide-react";

const GOOGLE_MAPS_EMBED_URL =
  "https://www.google.com/maps/d/embed?mid=1O1iMTPxo5FchcKvnr-xBi9QxhEH6Qpw&hl=pt-BR&ll=-15.821434838292866%2C-48.057292181771&z=14";

export default function MapaEstrategico() {
  const { unidades, isLoading, error } = useUnidadesData();
  if (isLoading || error) return <UnidadesLoadState loading={isLoading} error={error} />;

  return (
    <AppLayout>
      <div className="p-6 space-y-4 max-w-[1400px]">
        <div>
          <h1 className="text-2xl font-bold">Mapa Estratégico da Rede</h1>
          <p className="text-sm text-muted-foreground">
            Distribuição geográfica — {unidades.length} unidades
          </p>
        </div>

        <Card>
          <CardContent className="p-0 overflow-hidden rounded-lg">
            <iframe
              src={GOOGLE_MAPS_EMBED_URL}
              className="w-full border-0"
              style={{ height: "calc(100vh - 200px)", minHeight: "500px" }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Mapa Estratégico da Rede"
            />
          </CardContent>
        </Card>

        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <MapPin className="w-4 h-4" />
          <span>{unidades.length} unidades mapeadas no Google My Maps</span>
        </div>
      </div>
    </AppLayout>
  );
}
