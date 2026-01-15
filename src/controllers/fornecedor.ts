import { prisma } from "../lib/prisma.js";

interface Prop {
  id?: string;
  uf?: string;
  name?: string;
  cnpj?: string;
  municipio?: string;
  include?: {
    FornecedorCnds?: boolean | {
      include?: {
        CndType: boolean
      }
    };
  };
}

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

  static async getFornecedor(prop: Prop) {
    const fornecedor = await prisma.fornecedor.findMany({
      where: {
        ativo: true,
        ...(prop.id && { id: prop.id }),
        ...(prop.uf && { uf: prop.uf }),
        ...(prop.municipio && { municipio: prop.municipio }),
        ...(prop.name && { name: prop.name }),
        ...(prop.cnpj && { cnpj: prop.cnpj }),
      },
      ...(prop.include && { include: prop.include }),
    });

    return fornecedor;
  }
}

export default FornecedorManager;
