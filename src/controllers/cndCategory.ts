import { prisma } from "../lib/prisma.js";
import * as z from "zod";
import { queryCndCategory } from "../schemas/cndCategory.js";
import { CndCategory } from "@prisma/client";

class CndCategoryManager {
  static async newCndCategory(
    cndTypeId: string,
    uf?: string | null,
    municipio?: string | null,
    instructions?: any,
  ): Promise<CndCategory> {
    console.log('[CndCategoryManager.newCndCategory] Criando nova categoria de CND:', 
      { cndTypeId, uf, municipio });
    
    const cndCategory = await prisma.cndCategory.create({
      data: {
        cndTypeId,
        ...(uf && { uf }),
        ...(municipio && { municipio }),
        ...(instructions && { instructions }),
      },
    });
    
    console.log('[CndCategoryManager.newCndCategory] Categoria criada com sucesso:', cndCategory);
    return cndCategory;
  }

  static async getCndCategories(
    prop: z.infer<typeof queryCndCategory>,
  ): Promise<CndCategory[]> {
    console.log('[CndCategoryManager.getCndCategories] Buscando categorias com filtros:', prop);
    
    const cndCategories = await prisma.cndCategory.findMany({
      ...(prop.where && { where: prop.where }),
      ...(prop.orderBy && { orderBy: prop.orderBy }),
      ...(prop.include && { include: prop.include }),
      ...(prop.limit && { take: prop.limit }),
      ...(prop.page && { skip: (prop.page - 1) * prop.limit! }),
      ...(prop.select && { select: prop.select }),
    });
    
    console.log('[CndCategoryManager.getCndCategories] Encontrados', cndCategories.length, 'registros');
    return cndCategories;
  }
}

export default CndCategoryManager;