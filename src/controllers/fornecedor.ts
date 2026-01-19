import z from "zod";
import { prisma } from "../lib/prisma.js";
import { queryFornecedor } from "../schemas/fornecedor.js";

class FornecedorManager {
  static async newFornecedor(
    cnpj: string,
    name: string,
    uf?: string,
    municipio?: string
  ) {
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

  static async getFornecedor(prop: z.infer<typeof queryFornecedor>) {
    const fornecedor = await prisma.fornecedor.findMany({});
    return fornecedor;
  }
}

export default FornecedorManager;
