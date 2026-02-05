import { prisma } from "../lib/prisma.js";
import * as z from "zod";
import { queryCndType } from "../schemas/cndtype.js";
import { CndType } from "@prisma/client";

class CndTypeManager {
  static async newCndType(
    uf: string | undefined,
    municipio: string | undefined,
    tipo: string,
    instructions: any,
  ): Promise<CndType> {
    console.log('[CndTypeManager.newCndType] Criando novo tipo de CND:', { uf, municipio, tipo });
    const cndType = await prisma.cndType.create({
      data: {
        uf,
        tipo,
        ...(municipio && { municipio: municipio }),
        ...(instructions && { instructions: instructions }),
      },
    });
    console.log('[CndTypeManager.newCndType] CND criada com sucesso:', cndType);
    return cndType;
  }

  static async getCndType(
    prop: z.infer<typeof queryCndType>,
  ): Promise<CndType[]> {
    console.log('[CndTypeManager.getCndType] Buscando tipos de CND com filtros:', prop);
    const cndType = await prisma.cndType.findMany({
      ...(prop.where && { where: prop.where }),
      ...(prop.orderBy && { orderBy: prop.orderBy }),
      ...(prop.include && { include: prop.include }),
      ...(prop.limit && { take: prop.limit }),
      ...(prop.page && { skip: (prop.page - 1) * prop.limit! }),
      ...(prop.select && { select: prop.select }),
    });
    console.log('[CndTypeManager.getCndType] Encontrados', cndType.length, 'registros');
    return cndType;
  }
}

export default CndTypeManager;
