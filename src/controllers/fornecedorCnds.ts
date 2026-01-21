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
      return "deu errado na chamada da api";
    }

    const file_name = response.details.files_saved[0].path;

    const validade = await Utils.get_validade(file_name);
    if (!validade) {
      return "nao deu pra achar a validade desse cnd";
    }

    return await prisma.fornecedorCnd.create({
      data: {
        fornecedorid: fornecedorid,
        cndtypeid: cndtypeid,
        file_name: file_name,
        validade: validade,
      },
    });
  }

  static async getCnd(prop: z.infer<typeof queryFornecedorCnds>) {
    return await prisma.fornecedorCnd.findMany({
      ...(prop.where && { where: prop.where }),
      ...(prop.orderBy && { orderBy: prop.orderBy }),
      ...(prop.include && { include: prop.include }),
      ...(prop.limit && { take: prop.limit }),
      ...(prop.page && { skip: (prop.page - 1) * prop.limit! }),
    });
  }
}

export default FornecedorCndsManager;
