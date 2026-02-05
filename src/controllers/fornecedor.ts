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
    console.log('[FornecedorManager.newFornecedor] Criando novo fornecedor:', { cnpj, name, uf, municipio });
    const fornecedor = await prisma.fornecedor.create({
      data: {
        cnpj,
        name,
        ...(uf && { uf: uf }),
        ...(municipio && { municipio: municipio }),
      },
    });
    console.log('[FornecedorManager.newFornecedor] Fornecedor criado com sucesso:', fornecedor);
    return fornecedor;
  }

  static async getFornecedor(
    prop: z.infer<typeof queryFornecedor>,
  ): Promise<Fornecedor[]> {
    console.log('[FornecedorManager.getFornecedor] Buscando fornecedores com filtros:', prop);
    const fornecedor = await prisma.fornecedor.findMany({
      ...(prop.where && { where: prop.where }),
      ...(prop.orderBy && { orderBy: prop.orderBy }),
      ...(prop.include && { include: prop.include }),
      ...(prop.limit && { take: prop.limit }),
      ...(prop.page && { skip: (prop.page - 1) * prop.limit! }),
      ...(prop.select && { select: prop.select }),
    });
    console.log('[FornecedorManager.getFornecedor] Encontrados', fornecedor.length, 'registros');
    return fornecedor;
  }
}

export default FornecedorManager;
