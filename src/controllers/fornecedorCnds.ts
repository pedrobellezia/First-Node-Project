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
      return "Fornecedor ou tipo de CND não encontrado";
    }

    const response = await getCndfromApi(
      fornecedor[0].cnpj,
      cndtype[0].tipo,
      cndtype[0].uf ?? undefined,
      cndtype[0].municipio ?? undefined,
    );

    if (response.status_code !== 200) {
      return "Erro na chamada da API de CND";
    }

    const file_name = response.details.files_saved[0].path;

    const result = await Utils.get_validade(
      file_name,
      cndtype[0].tipo as "fgts" | "trabalhista" | "municipal" | "estadual",
    );

    if (result.certidao === null) {
      return result.detail ?? "Não foi possível interpretar a certidão";
    }

    if (result.certidao === false) {
      return "Certidão positiva com débitos";
    }

    if (!result.validade) {
      return "Certidão válida, porém não foi possível identificar a validade";
    }

    const createdCnd = await prisma.fornecedorCnd.create({
      data: {
        fornecedorid,
        cndtypeid,
        file_name,
        validade: result.validade,
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
