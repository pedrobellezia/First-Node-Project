import { Router } from "express";
import { prisma } from "../lib/prisma.js";
import getCndfromApi from "../lib/call_cnd_api.js";
import FornecedorManager from "../controllers/fornecedor.js";
import CndTypeManager from "../controllers/cndtype.js";

interface Prop {
  id?: string;
  Fornecedor?: {
    ativo?: boolean;
    id?: string;
    name?: string;
    cnpj?: string;
    uf?: string;
    municipio?: string;
  };
  CndType?: {
    ativo?: boolean;
    id?: string;
    tipo?: string;
    uf?: string;
    municipio?: string;
  };
  include?: {
    Fornecedor: boolean;
    CndType: boolean;
  };
}

const cndRoute = Router();

class CndManager {
  static async newCnd(fornecedorid: string, cndtypeid: string) {
    const fornecedor = await FornecedorManager.getFornecedor({id: fornecedorid});
    const cndtype = await CndTypeManager.getCndType({id: cndtypeid});

    if (!fornecedor.length || !cndtype.length) {
      return;
    }

    const response = await getCndfromApi(
      fornecedor[0].cnpj,
      cndtype[0].tipo,
      cndtype[0].uf,
      cndtype[0].municipio
    );

    if (response.status_code === 200) {
      const file_name = response.details.files_saved[0];

      return await prisma.fornecedorCnd.create({
        data: {
          fornecedorid: fornecedorid,
          cndtypeid: cndtypeid,
          file_name: file_name.path,
        },
      });
    } else {
      return "deu errado na chamada da api";
    }
  }

  static async getCnd(prop: Prop) {
    return await prisma.fornecedorCnd.findMany({
      where: {
        ativo: true,
        ...(prop.id && {id: prop.id}),
        ...(prop.CndType && { CndType: { is: {...prop.CndType, ativo:true} } }),
        ...(prop.Fornecedor && { Fornecedor: { is: {...prop.Fornecedor, ativo:true} } }),
      },
      ...(prop.include && { include: prop.include }),
    });
  }
}

export default CndManager;
