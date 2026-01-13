import { promises } from "node:dns";
import { prisma } from "../lib/prisma";

class CndTypeManager {
  static async newCndType(
    uf: string | undefined,
    municipio: string | undefined,
    tipo: string,
    instructions: any
  ) {
    const cndType = await prisma.cndType.create({
      data: {
        uf,
        tipo,
        ...(municipio && { municipio: municipio }),
        ...(instructions && { instructions: instructions }),
      },
    });
    return cndType;
  }

  static async getCndType(
    id?: string,
    uf?: string,
    municipio?: string,
    tipo?: string
  ): Promise<any[]> {
    const cndType = await prisma.cndType.findMany({
      where: {
        ativo: true,
        ...(id && { id: id }),
        ...(uf && { uf: uf }),
        ...(municipio && { municipio: municipio }),
        ...(tipo && { tipo: tipo }),
      },
    });
    return cndType;
  }
}

export default CndTypeManager;
