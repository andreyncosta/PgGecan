/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** URL do array JSON de Unidade (camelCase). Vazio = /data/unidades.json */
  readonly VITE_UNIDADES_JSON_URL?: string;
  /** Intervalo em ms para refetch do JSON (polling). 0 = desliga. Útil em preview: ex. 3000 */
  readonly VITE_UNIDADES_REFETCH_MS?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
