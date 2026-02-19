import { prisma } from "../lib/prisma.js";
import * as z from "zod";
import { queryFornecedor } from "../schemas/fornecedor.js";
import { Fornecedor } from "@prisma/client";

class FornecedorManager {
  static async newFornecedor(
    cnpj: string,
    name: string,
    uf?: string | null,
    municipio?: string | null,
  ): Promise<Fornecedor> {
    console.log('[FornecedorManager.newFornecedor] Criando novo fornecedor:', 
      { cnpj, name, uf, municipio });
    
    const fornecedor = await prisma.fornecedor.create({
      data: {
        cnpj,
        name,
        ...(uf && { uf }),
        ...(municipio && { municipio }),
      },
    });
    
    console.log('[FornecedorManager.newFornecedor] Fornecedor criado com sucesso:', fornecedor);
    return fornecedor;
  }

  static async getFornecedores(
    prop: z.infer<typeof queryFornecedor>,
  ): Promise<Fornecedor[]> {
    console.log('[FornecedorManager.getFornecedores] Buscando fornecedores com filtros:', prop);
    
    const fornecedores = await prisma.fornecedor.findMany({
      where: {ativo: true},
      ...(prop.where && { where: prop.where }),
      ...(prop.orderBy && { orderBy: prop.orderBy }),
      ...(prop.include && { include: prop.include }),
      ...(prop.limit && { take: prop.limit }),
      ...(prop.page && { skip: (prop.page - 1) * prop.limit! }),
      ...(prop.select && { select: prop.select }),
    });
    
    console.log('[FornecedorManager.getFornecedores] Encontrados', fornecedores.length, 'registros');
    return fornecedores;
  }
}

export default FornecedorManager;