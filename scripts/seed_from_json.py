"""Load unidades from data/unidades_seed.json (array of Unidade objects, camelCase)."""

from __future__ import annotations

import json
import sqlite3
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DB_PATH = ROOT / "gecan.db"
DEFAULT_JSON = ROOT / "data" / "unidades_seed.json"

COLS = [
    "id", "nome", "codigo", "uf", "ra", "uf_ra",
    "resultado", "resultado_com_dg", "rla", "desp_adm_total", "alugueis", "custo_ocupacao",
    "producao_total", "atendimento_total", "caixa_total", "gerencia_total", "atendimento_col",
    "dea", "clientes", "gerentes", "receita_colab", "custo_atendimento", "pct_caixa",
    "metas_media", "metas_1s24", "metas_2s24", "metas_1s25", "metas_2s25", "data_abertura",
    "alta_ma", "media_alta_ma", "media_ma", "baixa_ma", "middle",
    "empresarial", "empresas", "empreendedor", "consignado", "imobiliario",
    "parcelado_pf", "parcelado_pj", "plano_empresario", "rotativo_pf", "rotativo_pj", "agro",
    "taxa_conversao", "novo_modelo", "encerramento", "qt_contratos", "vl_producao_visita",
    "nr_portabilidade", "vl_seguros_total",
    "tipologia", "endereco", "metragem_quadrada", "superintendencia", "porte", "horario_funcionamento",
    "dentro_orgao", "escriturarios", "gerente_negocio", "gerente_expediente", "gerente_geral",
    "caixa_bancario", "demais_cargos", "qt_contratos_visita",
]

KEYS = [
    "id", "nome", "codigo", "uf", "ra", "ufRa",
    "resultado", "resultadoComDG", "rla", "despAdmTotal", "alugueis", "custoOcupacao",
    "producaoTotal", "atendimentoTotal", "caixaTotal", "gerenciaTotal", "atendimentoCol",
    "dea", "clientes", "gerentes", "receitaColab", "custoAtendimento", "pctCaixa",
    "metasMedia", "metas1s24", "metas2s24", "metas1s25", "metas2s25", "dataAbertura",
    "altaMa", "mediaAltaMa", "mediaMa", "baixaMa", "middle",
    "empresarial", "empresas", "empreendedor", "consignado", "imobiliario",
    "parceladoPf", "parceladoPj", "planoEmpresario", "rotativoPf", "rotativoPj", "agro",
    "taxaConversao", "novoModelo", "encerramento", "qtContratos", "vlProducaoVisita",
    "nrPortabilidade", "vlSegurosTotal",
    "tipologia", "endereco", "metragemQuadrada", "superintendencia", "porte", "horarioFuncionamento",
    "_dentroOrgao", "escriturarios", "gerenteNegocio", "gerenteExpediente", "gerenteGeral",
    "caixaBancario", "demaisCargos", "qtContratosVisita",
]

SQL = (
    "INSERT OR REPLACE INTO unidades ("
    + ",".join(COLS)
    + ") VALUES ("
    + ",".join(["?"] * len(COLS))
    + ")"
)


def row_from(u: dict) -> tuple:
    dentro = 1 if u.get("dentroOrgao") else 0
    vals = []
    for k in KEYS:
        if k == "_dentroOrgao":
            vals.append(dentro)
        else:
            vals.append(u.get(k))
    return tuple(vals)


def main() -> int:
    path = Path(sys.argv[1]) if len(sys.argv) > 1 else DEFAULT_JSON
    if not path.is_file():
        print(f"Missing {path}", file=sys.stderr)
        return 1
    if not DB_PATH.is_file():
        print(f"Run init_db.py first (missing {DB_PATH})", file=sys.stderr)
        return 1
    if len(KEYS) != len(COLS):
        print("Internal error: KEYS/COLS length mismatch", file=sys.stderr)
        return 1
    raw = json.loads(path.read_text(encoding="utf-8"))
    if not isinstance(raw, list):
        print("JSON must be an array of unidades", file=sys.stderr)
        return 1
    conn = sqlite3.connect(DB_PATH)
    try:
        conn.executemany(SQL, [row_from(u) for u in raw])
        conn.commit()
    finally:
        conn.close()
    print(f"OK: seeded {len(raw)} rows into {DB_PATH}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
