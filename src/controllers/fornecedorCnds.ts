import { prisma } from "../lib/prisma.js";
import getCndfromApi from "../lib/call_cnd_api.js";
import FornecedorManager from "./fornecedor.js";
import CndTypeManager from "./cndtype.js";
import Utils from "../lib/utils.js";
import z from "zod";
import { queryFornecedorCnds } from "../schemas/fornecedorCnds.js";
import { FornecedorCnd } from "@prisma/client";

class FornecedorCndsManager {
  static async newCnd(
    fornecedorid: string,
    cndtypeid: string,
  ): Promise<FornecedorCnd | string> {
    const fornecedor = await FornecedorManager.getFornecedor({
      where: { id: fornecedorid },
    });

    const cndtype = await CndTypeManager.getCndType({
      where: { id: cndtypeid },
    });

    if (!fornecedor.length || !cndtype.length) {
      console.error('[FornecedorCndsManager.newCnd] ERRO: Fornecedor ou tipo de CND não encontrado');
      return "Fornecedor ou tipo de CND não encontrado";
    }

    console.log('[FornecedorCndsManager.newCnd] Fornecedor e tipo encontrados. Chamando API...');
    const response = await getCndfromApi(
      fornecedor[0].cnpj,
      cndtype[0].tipo,
      cndtype[0].uf ?? undefined,
      cndtype[0].municipio ?? undefined,
    );

    if (response.status_code !== 200) {
      console.error('[FornecedorCndsManager.newCnd] ERRO: Falha na API. Status:', response.status_code);
      return "Erro na chamada da API de CND";
    }

    console.log('[FornecedorCndsManager.newCnd] API retornou sucesso. Processando arquivo...');
    const file_name = response.details.files_saved[0].path;

    const result = await Utils.get_validade(
      file_name,
      cndtype[0].tipo as "fgts" | "trabalhista" | "municipal" | "estadual",
    );

    if (result.certidao === null) {
      console.error('[FornecedorCndsManager.newCnd] ERRO: Não foi possível interpretar a certidão');
      return result.detail ?? "Não foi possível interpretar a certidão";
    }

    if (result.certidao === false) {
      console.warn('[FornecedorCndsManager.newCnd] AVISO: Certidão positiva com débitos');
      return "Certidão positiva com débitos";
    }

    if (!result.validade) {
      console.warn('[FornecedorCndsManager.newCnd] AVISO: Não foi possível identificar a validade');
      return "Certidão válida, porém não foi possível identificar a validade";
    }

    console.log('[FornecedorCndsManager.newCnd] Validações passaram. Validade:', result.validade);
    
    const [dia, mes, ano] = result.validade.split('/');
    const validadeDate = new Date(`${ano}-${mes}-${dia}`);
    
    const createdCnd = await prisma.fornecedorCnd.create({
      data: {
        fornecedorid,
        cndtypeid,
        file_name,
        validade: validadeDate, 
      },
    });

    console.log(
      `CND criada com sucesso | Fornecedor: ${fornecedor[0].cnpj} | Tipo: ${cndtype[0].tipo} | Validade: ${createdCnd.validade}`,
    );

    return createdCnd;
  }

  static async getCnd(prop: z.infer<typeof queryFornecedorCnds>) {
    console.log(prop);
    const filter = {
      ...(prop.where && { where: prop.where }),
      ...(prop.orderBy && { orderBy: prop.orderBy }),
      ...(prop.include && { include: prop.include }),
      ...(prop.limit && { take: prop.limit }),
      ...(prop.page && { skip: (prop.page - 1) * prop.limit! }),
      ...(prop.select && { select: prop.select }),
    };
    console.log(filter);
    return await prisma.fornecedorCnd.findMany(filter);
  }
}

export default FornecedorCndsManager;
