import z from "zod";
import { prisma } from "../lib/prisma.js";
import { queryFornecedor } from "../schemas/fornecedor.js";
import { Fornecedor } from "@prisma/client";

class FornecedorManager {
  static async newFornecedor(
    cnpj: string,
    name: string,
    uf?: string,
    municipio?: string,
  ): Promise<Fornecedor | []> {
    const fornecedor = await prisma.fornecedor.create({
      data: {
        cnpj,
        name,
        ...(uf && { uf: uf }),
        ...(municipio && { municipio: municipio }),
      },
    });
    return fornecedor;
  }

  static async getFornecedor(
    prop: z.infer<typeof queryFornecedor>,
  ): Promise<Fornecedor[]> {
    const fornecedor = await prisma.fornecedor.findMany({
      ...(prop.where && { where: prop.where }),
      ...(prop.orderBy && { orderBy: prop.orderBy }),
      ...(prop.include && { include: prop.include }),
      ...(prop.limit && { take: prop.limit }),
      ...(prop.page && { skip: (prop.page - 1) * prop.limit! }),
    });
    return fornecedor;
  }
}

export default FornecedorManager;
