import { prisma } from "../lib/prisma.js";
import * as z from "zod";
import { queryFornecedorCategory } from "../schemas/fornecedorCategory.js";
import { FornecedorCategory } from "@prisma/client";

class FornecedorCategoryManager {
  static async newFornecedorCategory(
    fornecedorId: string,
    cndCategoryId: string,
  ): Promise<FornecedorCategory> {
    console.log('[FornecedorCategoryManager.newFornecedorCategory] Vinculando fornecedor à categoria:', 
      { fornecedorId, cndCategoryId });
    
    const fornecedorCategory = await prisma.fornecedorCategory.create({
      data: {
        fornecedorId,
        cndCategoryId,
      },
    });
    
    console.log('[FornecedorCategoryManager.newFornecedorCategory] Vínculo criado com sucesso:', 
      fornecedorCategory);
    return fornecedorCategory;
  }

  static async getFornecedorCategories(
    prop: z.infer<typeof queryFornecedorCategory>,
  ): Promise<FornecedorCategory[]> {
    console.log('[FornecedorCategoryManager.getFornecedorCategories] Buscando vínculos com filtros:', prop);
    
    const fornecedorCategories = await prisma.fornecedorCategory.findMany({
      ...(prop.where && { where: prop.where }),
      ...(prop.orderBy && { orderBy: prop.orderBy }),
      ...(prop.include && { include: prop.include }),
      ...(prop.limit && { take: prop.limit }),
      ...(prop.page && { skip: (prop.page - 1) * prop.limit! }),
      ...(prop.select && { select: prop.select }),
    });
    
    console.log('[FornecedorCategoryManager.getFornecedorCategories] Encontrados', 
      fornecedorCategories.length, 'registros');
    
    return fornecedorCategories;
  }
}

export default FornecedorCategoryManager;