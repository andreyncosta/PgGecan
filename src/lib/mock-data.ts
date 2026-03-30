// Tipos e formatadores — dados vêm de JSON (ver load-unidades / useUnidades).

export interface Unidade {
  id: number;
  nome: string;
  codigo: string;
  uf: string;
  ra: string;
  ufRa: string;
  resultado: number;
  resultadoComDG: number;
  rla: number;
  despAdmTotal: number;
  alugueis: number;
  custoOcupacao: number;
  producaoTotal: number;
  atendimentoTotal: number;
  caixaTotal: number;
  gerenciaTotal: number;
  atendimentoCol: number;
  dea: number;
  clientes: number;
  gerentes: number;
  receitaColab: number;
  custoAtendimento: number;
  pctCaixa: number;
  metasMedia: number;
  metas1s24: number;
  metas2s24: number;
  metas1s25: number;
  metas2s25: number;
  dataAbertura: string;
  altaMa: number;
  mediaAltaMa: number;
  mediaMa: number;
  baixaMa: number;
  middle: number;
  empresarial: number;
  empresas: number;
  empreendedor: number;
  consignado: number;
  imobiliario: number;
  parceladoPf: number;
  parceladoPj: number;
  planoEmpresario: number;
  rotativoPf: number;
  rotativoPj: number;
  agro: number;
  taxaConversao: string;
  novoModelo: string;
  encerramento: string;
  qtContratos: number;
  vlProducaoVisita: number;
  nrPortabilidade: number;
  vlSegurosTotal: number;
  tipologia: string;
  endereco: string;
  metragemQuadrada: number;
  superintendencia: string;
  porte: number;
  horarioFuncionamento: string;
  dentroOrgao: boolean;
  escriturarios: number;
  gerenteNegocio: number;
  gerenteExpediente: number;
  gerenteGeral: number;
  caixaBancario: number;
  demaisCargos: number;
  qtContratosVisita: number;
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 }).format(value);
}

export function formatPercent(value: number): string {
  return `${value.toFixed(1)}%`;
}

export function getStatusColor(value: number, thresholds: [number, number]): string {
  if (value >= thresholds[1]) return "text-success";
  if (value >= thresholds[0]) return "text-warning";
  return "text-destructive";
}
