import { prisma } from "../lib/prisma.js";
import getCndfromApi from "../lib/call_cnd_api.js";
import FornecedorManager from "./fornecedor.js";
import CndTypeManager from "./cndtype.js";
import Utils from "../lib/utils.js";
import z from "zod";
import { queryFornecedorCnds } from "../schemas/fornecedorCnds.js";

class FornecedorCndsManager {
  static async newCnd(fornecedorid: string, cndtypeid: string) {
    const fornecedor = await FornecedorManager.getFornecedor({
      where: { id: fornecedorid },
    });
    const cndtype = await CndTypeManager.getCndType({
      where: { id: cndtypeid },
    });

    if (!fornecedor.length || !cndtype.length) {
      return;
    }

    const response = await getCndfromApi(
      fornecedor[0].cnpj,
      cndtype[0].tipo,
      cndtype[0].uf,
      cndtype[0].municipio
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
    return await prisma.fornecedorCnd.findMany({});
  }
}

export default FornecedorCndsManager;
