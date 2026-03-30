"""ORM model for `unidades` (see db/schema.sql)."""

from django.db import models


class Unidade(models.Model):
    id = models.IntegerField(primary_key=True)
    nome = models.TextField()
    codigo = models.TextField(null=True, blank=True)
    uf = models.TextField(null=True, blank=True)
    ra = models.TextField(null=True, blank=True)
    uf_ra = models.TextField(null=True, blank=True)
    resultado = models.FloatField(null=True, blank=True)
    resultado_com_dg = models.FloatField(null=True, blank=True)
    rla = models.FloatField(null=True, blank=True)
    desp_adm_total = models.FloatField(null=True, blank=True)
    alugueis = models.FloatField(null=True, blank=True)
    custo_ocupacao = models.FloatField(null=True, blank=True)
    producao_total = models.FloatField(null=True, blank=True)
    atendimento_total = models.IntegerField(null=True, blank=True)
    caixa_total = models.IntegerField(null=True, blank=True)
    gerencia_total = models.IntegerField(null=True, blank=True)
    atendimento_col = models.IntegerField(null=True, blank=True)
    dea = models.FloatField(null=True, blank=True)
    clientes = models.IntegerField(null=True, blank=True)
    gerentes = models.IntegerField(null=True, blank=True)
    receita_colab = models.FloatField(null=True, blank=True)
    custo_atendimento = models.FloatField(null=True, blank=True)
    pct_caixa = models.FloatField(null=True, blank=True)
    metas_media = models.FloatField(null=True, blank=True)
    metas_1s24 = models.FloatField(null=True, blank=True)
    metas_2s24 = models.FloatField(null=True, blank=True)
    metas_1s25 = models.FloatField(null=True, blank=True)
    metas_2s25 = models.FloatField(null=True, blank=True)
    data_abertura = models.TextField(null=True, blank=True)
    alta_ma = models.IntegerField(null=True, blank=True)
    media_alta_ma = models.IntegerField(null=True, blank=True)
    media_ma = models.IntegerField(null=True, blank=True)
    baixa_ma = models.IntegerField(null=True, blank=True)
    middle = models.IntegerField(null=True, blank=True)
    empresarial = models.IntegerField(null=True, blank=True)
    empresas = models.IntegerField(null=True, blank=True)
    empreendedor = models.IntegerField(null=True, blank=True)
    consignado = models.FloatField(null=True, blank=True)
    imobiliario = models.FloatField(null=True, blank=True)
    parcelado_pf = models.FloatField(null=True, blank=True)
    parcelado_pj = models.FloatField(null=True, blank=True)
    plano_empresario = models.FloatField(null=True, blank=True)
    rotativo_pf = models.FloatField(null=True, blank=True)
    rotativo_pj = models.FloatField(null=True, blank=True)
    agro = models.FloatField(null=True, blank=True)
    taxa_conversao = models.TextField(null=True, blank=True)
    novo_modelo = models.TextField(null=True, blank=True)
    encerramento = models.TextField(null=True, blank=True)
    qt_contratos = models.IntegerField(null=True, blank=True)
    vl_producao_visita = models.FloatField(null=True, blank=True)
    nr_portabilidade = models.IntegerField(null=True, blank=True)
    vl_seguros_total = models.FloatField(null=True, blank=True)
    tipologia = models.TextField(null=True, blank=True)
    endereco = models.TextField(null=True, blank=True)
    metragem_quadrada = models.IntegerField(null=True, blank=True)
    superintendencia = models.TextField(null=True, blank=True)
    porte = models.IntegerField(null=True, blank=True)
    horario_funcionamento = models.TextField(null=True, blank=True)
    dentro_orgao = models.BooleanField(default=False)
    escriturarios = models.IntegerField(null=True, blank=True)
    gerente_negocio = models.IntegerField(null=True, blank=True)
    gerente_expediente = models.IntegerField(null=True, blank=True)
    gerente_geral = models.IntegerField(null=True, blank=True)
    caixa_bancario = models.IntegerField(null=True, blank=True)
    demais_cargos = models.IntegerField(null=True, blank=True)
    qt_contratos_visita = models.IntegerField(null=True, blank=True)

    class Meta:
        db_table = "unidades"
        ordering = ["id"]

    def to_api_dict(self) -> dict:
        row = self
        return {
            "id": row.id,
            "nome": row.nome,
            "codigo": row.codigo or "",
            "uf": row.uf or "",
            "ra": row.ra or "",
            "ufRa": row.uf_ra or "",
            "resultado": row.resultado or 0.0,
            "resultadoComDG": row.resultado_com_dg or 0.0,
            "rla": row.rla or 0.0,
            "despAdmTotal": row.desp_adm_total or 0.0,
            "alugueis": row.alugueis or 0.0,
            "custoOcupacao": row.custo_ocupacao or 0.0,
            "producaoTotal": row.producao_total or 0.0,
            "atendimentoTotal": row.atendimento_total or 0,
            "caixaTotal": row.caixa_total or 0,
            "gerenciaTotal": row.gerencia_total or 0,
            "atendimentoCol": row.atendimento_col or 0,
            "dea": row.dea or 0.0,
            "clientes": row.clientes or 0,
            "gerentes": row.gerentes or 0,
            "receitaColab": row.receita_colab or 0.0,
            "custoAtendimento": row.custo_atendimento or 0.0,
            "pctCaixa": row.pct_caixa or 0.0,
            "metasMedia": row.metas_media or 0.0,
            "metas1s24": row.metas_1s24 or 0.0,
            "metas2s24": row.metas_2s24 or 0.0,
            "metas1s25": row.metas_1s25 or 0.0,
            "metas2s25": row.metas_2s25 or 0.0,
            "dataAbertura": row.data_abertura or "",
            "altaMa": row.alta_ma or 0,
            "mediaAltaMa": row.media_alta_ma or 0,
            "mediaMa": row.media_ma or 0,
            "baixaMa": row.baixa_ma or 0,
            "middle": row.middle or 0,
            "empresarial": row.empresarial or 0,
            "empresas": row.empresas or 0,
            "empreendedor": row.empreendedor or 0,
            "consignado": row.consignado or 0.0,
            "imobiliario": row.imobiliario or 0.0,
            "parceladoPf": row.parcelado_pf or 0.0,
            "parceladoPj": row.parcelado_pj or 0.0,
            "planoEmpresario": row.plano_empresario or 0.0,
            "rotativoPf": row.rotativo_pf or 0.0,
            "rotativoPj": row.rotativo_pj or 0.0,
            "agro": row.agro or 0.0,
            "taxaConversao": row.taxa_conversao or "",
            "novoModelo": row.novo_modelo or "",
            "encerramento": row.encerramento or "",
            "qtContratos": row.qt_contratos or 0,
            "vlProducaoVisita": row.vl_producao_visita or 0.0,
            "nrPortabilidade": row.nr_portabilidade or 0,
            "vlSegurosTotal": row.vl_seguros_total or 0.0,
            "tipologia": row.tipologia or "",
            "endereco": row.endereco or "",
            "metragemQuadrada": row.metragem_quadrada or 0,
            "superintendencia": row.superintendencia or "",
            "porte": row.porte or 0,
            "horarioFuncionamento": row.horario_funcionamento or "",
            "dentroOrgao": bool(row.dentro_orgao),
            "escriturarios": row.escriturarios or 0,
            "gerenteNegocio": row.gerente_negocio or 0,
            "gerenteExpediente": row.gerente_expediente or 0,
            "gerenteGeral": row.gerente_geral or 0,
            "caixaBancario": row.caixa_bancario or 0,
            "demaisCargos": row.demais_cargos or 0,
            "qtContratosVisita": row.qt_contratos_visita or 0,
        }
