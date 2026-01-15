import { prisma } from "../lib/prisma.js";

interface Prop {
  id?: string;
  uf?: string;
  municipio?: string;
  tipo?: string;
}

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

  static async getCndType(prop: Prop): Promise<any[]> {
    const cndType = await prisma.cndType.findMany({
      where: {
        ativo: true,
        ...prop
      },
    });
    return cndType;
  }
}

export default CndTypeManager;
