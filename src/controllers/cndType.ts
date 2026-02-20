import { prisma } from "../lib/prisma.js";
import * as z from "zod";
import { queryCndType } from "../schemas/cndType.js";
import { CndType } from "@prisma/client";
import { ConflictError } from "../lib/error.js";

class CndTypeManager {
  static async newCndType(
    tipo: string,
    diasRestantes: number,
  ): Promise<CndType> {
    console.log("[CndTypeManager.newCndType] Criando novo tipo de CND:", {
      tipo,
    });

    const exist = await prisma.cndType.findFirst({
      where: { tipo },
    });

    if (exist) {
      throw new ConflictError(`Tipo de CND "${tipo}" já existe.`);
    }

    const cndType = await prisma.cndType.create({
      data: {
        tipo,
        diasRestantes,
      },
    });

    console.log(
      "[CndTypeManager.newCndType] Tipo de CND criado com sucesso:",
      cndType,
    );
    return cndType;
  }

  static async getCndTypes(
    prop: z.infer<typeof queryCndType>,
  ): Promise<CndType[]> {
    console.log(
      "[CndTypeManager.getCndTypes] Buscando tipos de CND com filtros:",
      prop,
    );

    const cndTypes = await prisma.cndType.findMany({
      ...(prop.where && { where: prop.where }),
      ...(prop.orderBy && { orderBy: prop.orderBy }),
      ...(prop.include && { include: prop.include }),
      ...(prop.limit && { take: prop.limit }),
      ...(prop.page && { skip: (prop.page - 1) * prop.limit! }),
      ...(prop.select && { select: prop.select }),
    });

    console.log(
      "[CndTypeManager.getCndTypes] Encontrados",
      cndTypes.length,
      "registros",
    );
    return cndTypes;
  }
}

export default CndTypeManager;
