import { prisma } from "../lib/prisma";

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

  static async getFornecedor(
    id?: any,
    uf?: any,
    municipio?: any,
    name?: any,
    cnpj?: any
  ): Promise<any[]> {
    
    const fornecedor = await prisma.fornecedor.findMany({
      where: {
        ativo: true,
        ...(id && { id: id }),
        ...(uf && { uf: uf }),
        ...(municipio && { municipio: municipio }),
        ...(name && { name: name }),
        ...(cnpj && { cnpj: cnpj }),
      },
    });

    return fornecedor;
  }
}

export default FornecedorManager;
