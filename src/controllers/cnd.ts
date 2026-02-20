import { prisma } from "../lib/prisma.js";
import getCndfromApi from "../lib/call_cnd_api.js";
import Utils from "../lib/utils.js";
import * as z from "zod";
import { queryCnd } from "../schemas/cnd.js";
import { Cnd } from "@prisma/client";
import FornecedorCategoryManager from "./fornecedorCategory.js";
import { NotFoundError } from "../lib/error.js";

class CndManager {
  static async newCnd(fornecedorCategoryId: string) {
    const fornecedorCategory =
      await FornecedorCategoryManager.getFornecedorCategories({
        where: { id: fornecedorCategoryId },
        include: {
          cndCategory: { include: { cndType: true } },
          fornecedor: true,
        },
      });

    if (!fornecedorCategory || fornecedorCategory.length === 0) {
      throw new NotFoundError(
        `FornecedorCategory com id ${fornecedorCategoryId} não encontrado`,
      );
    }
    // @ts-ignore
    const cndCategory = fornecedorCategory[0].cndCategory;
    // @ts-ignore
    const fornecedor = fornecedorCategory[0].fornecedor;

    const response = await getCndfromApi(
      fornecedor.cnpj,
      cndCategory.instructions,
    );

    if (!response) {
      throw new Error("CND API returned undefined");
    }

    if (response.status_code !== 200) {
      console.error(
        "[FornecedorCndsManager.newCnd] ERRO: Falha na API. Status:",
        response.status_code,
      );
      return "Erro na chamada da API de CND";
    }

    console.log(
      "[FornecedorCndsManager.newCnd] API retornou sucesso. Processando arquivo...",
    );
    console.log(
      "[FornecedorCndsManager.newCnd] Response details:",
      JSON.stringify(response, null, 2),
    );

    if (
      !response.details ||
      !response.details.files_saved ||
      response.details.files_saved.length === 0
    ) {
      console.error(
        "[FornecedorCndsManager.newCnd] ERRO: Resposta da API sem files_saved",
        response,
      );
      return "API retornou sucesso mas não gerou arquivo";
    }

    const file_name = response.details.files_saved[0].path;
    console.log("[FornecedorCndsManager.newCnd] Arquivo obtido:", file_name);

    const result = await Utils.get_validade(
      file_name,
      cndCategory.cndType.tipo,
    );

    console.log(result);
    if (result.certidao === null) {
      console.error(
        "[FornecedorCndsManager.newCnd] ERRO: Não foi possível interpretar a certidão",
      );
      return result.detail ?? "Não foi possível interpretar a certidão";
    }

    if (!result.validade) {
      console.warn(
        "[FornecedorCndsManager.newCnd] AVISO: Não foi possível identificar a validade",
      );
      return "Certidão válida, porém não foi possível identificar a validade";
    }

    console.log(
      "[FornecedorCndsManager.newCnd] Validações passaram. Validade:",
      result.validade,
      "Emissão:",
      result.emissao,
    );

    let validadeDate: Date;
    if (result.validade.includes("/")) {
      // Formato dd/mm/yyyy
      const [dia, mes, ano] = result.validade.split("/");
      validadeDate = new Date(`${ano}-${mes}-${dia}`);
    } else {
      // Formato ISO yyyy-mm-dd
      validadeDate = new Date(result.validade);
    }

    let emissaoDate: Date;
    if (result.emissao) {
      if (result.emissao.includes("/")) {
        // Formato dd/mm/yyyy
        const [dia, mes, ano] = result.emissao.split("/");
        emissaoDate = new Date(`${ano}-${mes}-${dia}`);
      } else {
        // Formato ISO yyyy-mm-dd
        emissaoDate = new Date(result.emissao);
      }
    } else {
      emissaoDate = new Date();
    }

    console.log(
      "[FornecedorCndsManager.newCnd] Datas formatadas - Validade:",
      validadeDate,
      "Emissão:",
      emissaoDate,
    );

    const createdCnd = await prisma.cnd.create({
      data: {
        fornecedorCategoryId,
        file_name,
        validade: validadeDate,
        emissao: emissaoDate,
        negativa: result.certidao,
      },
    });

    console.log(
      `CND criada com sucesso | Fornecedor: ${fornecedor.cnpj} | Tipo: ${cndCategory.cndType.tipo} | Validade: ${createdCnd.validade}`,
    );

    const cndsAtivas = await prisma.cnd.findMany({
      where: {
        fornecedorCategoryId,
        ativo: true,
        id: { not: createdCnd.id },
      },
    });

    if (cndsAtivas.length > 0) {
      console.log(
        `[CndManager.newCnd] Encontradas ${cndsAtivas.length} CND(s) ativa(s) anterior(es). Desativando...`,
      );

      await prisma.cnd.updateMany({
        where: {
          id: { in: cndsAtivas.map((cnd) => cnd.id) },
        },
        data: {
          ativo: false,
        },
      });

      console.log(
        `[CndManager.newCnd] ${cndsAtivas.length} CND(s) anterior(es) desativada(s) com sucesso`,
      );
    }

    return createdCnd;
  }

  static async getCnd(prop: z.infer<typeof queryCnd>): Promise<Cnd[]> {
    console.log(
      "[CndTypeManager.getCndTypes] Buscando tipos de CND com filtros:",
      prop,
    );

    const cnds = await prisma.cnd.findMany({
      ...(prop.where && { where: prop.where }),
      ...(prop.orderBy && { orderBy: prop.orderBy }),
      ...(prop.include && { include: prop.include }),
      ...(prop.limit && { take: prop.limit }),
      ...(prop.page && { skip: (prop.page - 1) * prop.limit! }),
      ...(prop.select && { select: prop.select }),
    });

    console.log("[CndManager.getCnd] Encontrados", cnds.length, "registros");
    return cnds;
  }
}

export default CndManager;
