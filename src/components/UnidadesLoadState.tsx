import { AppLayout } from "@/components/layout/AppLayout";

export function UnidadesLoadState({ loading, error }: { loading: boolean; error: Error | null }) {
  if (loading) {
    return (
      <AppLayout>
        <div className="flex min-h-[40vh] items-center justify-center p-8 text-muted-foreground">
          Carregando dados das unidades…
        </div>
      </AppLayout>
    );
  }
  if (error) {
    return (
      <AppLayout>
        <div className="flex min-h-[40vh] flex-col items-center justify-center gap-2 p-8 text-center">
          <p className="text-destructive font-medium">Não foi possível carregar os dados.</p>
          <p className="text-sm text-muted-foreground max-w-md">{error.message}</p>
        </div>
      </AppLayout>
    );
  }
  return null;
}
