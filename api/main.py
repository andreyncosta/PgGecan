"""
Read-only API for gecan.db. Run: uvicorn api.main:app --reload --port 8765
"""

from __future__ import annotations

import os
import sqlite3
from pathlib import Path

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

ROOT = Path(__file__).resolve().parent.parent
DB_PATH = Path(os.environ.get("GECAN_DB", str(ROOT / "gecan.db")))


def get_conn() -> sqlite3.Connection:
    conn = sqlite3.connect(DB_PATH, check_same_thread=False)
    conn.row_factory = sqlite3.Row
    return conn


def row_to_unidade(row: sqlite3.Row) -> dict:
    return {
        "id": row["id"],
        "nome": row["nome"],
        "codigo": row["codigo"] or "",
        "uf": row["uf"] or "",
        "ra": row["ra"] or "",
        "ufRa": row["uf_ra"] or "",
        "resultado": row["resultado"] or 0.0,
        "resultadoComDG": row["resultado_com_dg"] or 0.0,
        "rla": row["rla"] or 0.0,
        "despAdmTotal": row["desp_adm_total"] or 0.0,
        "alugueis": row["alugueis"] or 0.0,
        "custoOcupacao": row["custo_ocupacao"] or 0.0,
        "producaoTotal": row["producao_total"] or 0.0,
        "atendimentoTotal": row["atendimento_total"] or 0,
        "caixaTotal": row["caixa_total"] or 0,
        "gerenciaTotal": row["gerencia_total"] or 0,
        "atendimentoCol": row["atendimento_col"] or 0,
        "dea": row["dea"] or 0.0,
        "clientes": row["clientes"] or 0,
        "gerentes": row["gerentes"] or 0,
        "receitaColab": row["receita_colab"] or 0.0,
        "custoAtendimento": row["custo_atendimento"] or 0.0,
        "pctCaixa": row["pct_caixa"] or 0.0,
        "metasMedia": row["metas_media"] or 0.0,
        "metas1s24": row["metas_1s24"] or 0.0,
        "metas2s24": row["metas_2s24"] or 0.0,
        "metas1s25": row["metas_1s25"] or 0.0,
        "metas2s25": row["metas_2s25"] or 0.0,
        "dataAbertura": row["data_abertura"] or "",
        "altaMa": row["alta_ma"] or 0,
        "mediaAltaMa": row["media_alta_ma"] or 0,
        "mediaMa": row["media_ma"] or 0,
        "baixaMa": row["baixa_ma"] or 0,
        "middle": row["middle"] or 0,
        "empresarial": row["empresarial"] or 0,
        "empresas": row["empresas"] or 0,
        "empreendedor": row["empreendedor"] or 0,
        "consignado": row["consignado"] or 0.0,
        "imobiliario": row["imobiliario"] or 0.0,
        "parceladoPf": row["parcelado_pf"] or 0.0,
        "parceladoPj": row["parcelado_pj"] or 0.0,
        "planoEmpresario": row["plano_empresario"] or 0.0,
        "rotativoPf": row["rotativo_pf"] or 0.0,
        "rotativoPj": row["rotativo_pj"] or 0.0,
        "agro": row["agro"] or 0.0,
        "taxaConversao": row["taxa_conversao"] or "",
        "novoModelo": row["novo_modelo"] or "",
        "encerramento": row["encerramento"] or "",
        "qtContratos": row["qt_contratos"] or 0,
        "vlProducaoVisita": row["vl_producao_visita"] or 0.0,
        "nrPortabilidade": row["nr_portabilidade"] or 0,
        "vlSegurosTotal": row["vl_seguros_total"] or 0.0,
        "tipologia": row["tipologia"] or "",
        "endereco": row["endereco"] or "",
        "metragemQuadrada": row["metragem_quadrada"] or 0,
        "superintendencia": row["superintendencia"] or "",
        "porte": row["porte"] or 0,
        "horarioFuncionamento": row["horario_funcionamento"] or "",
        "dentroOrgao": bool(row["dentro_orgao"]),
        "escriturarios": row["escriturarios"] or 0,
        "gerenteNegocio": row["gerente_negocio"] or 0,
        "gerenteExpediente": row["gerente_expediente"] or 0,
        "gerenteGeral": row["gerente_geral"] or 0,
        "caixaBancario": row["caixa_bancario"] or 0,
        "demaisCargos": row["demais_cargos"] or 0,
        "qtContratosVisita": row["qt_contratos_visita"] or 0,
    }


app = FastAPI(title="GECAN API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=os.environ.get("GECAN_CORS", "http://localhost:8080,http://127.0.0.1:8080").split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/health")
def health():
    # Avoid exposing filesystem paths in responses (intranet still benefits from minimal disclosure).
    return {"ok": True, "db_ready": DB_PATH.is_file()}


@app.get("/api/unidades")
def list_unidades():
    if not DB_PATH.is_file():
        raise HTTPException(status_code=503, detail=f"Database not found: {DB_PATH}")
    conn = get_conn()
    try:
        cur = conn.execute("SELECT * FROM unidades ORDER BY id")
        return [row_to_unidade(r) for r in cur.fetchall()]
    finally:
        conn.close()


@app.get("/api/unidades/{unidade_id}")
def get_unidade(unidade_id: int):
    if not DB_PATH.is_file():
        raise HTTPException(status_code=503, detail=f"Database not found: {DB_PATH}")
    conn = get_conn()
    try:
        cur = conn.execute("SELECT * FROM unidades WHERE id = ?", (unidade_id,))
        row = cur.fetchone()
        if not row:
            raise HTTPException(status_code=404, detail="Unidade not found")
        return row_to_unidade(row)
    finally:
        conn.close()
