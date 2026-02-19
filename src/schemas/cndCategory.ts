import * as z from "zod";
import { selectCndType } from "./cndType.js";
import {
  selectFornecedorCategory,
  whereFornecedorCategory,
  orderByFornecedorCategory,
} from "./fornecedorCategory.js";

const whereCndCategory = z
  .object({
    ativo: z.boolean().default(true).optional(),
    uf: z.string().optional(),
    municipio: z.string().optional(),
    cndTypeId: z.string().optional(),
    id: z.string().optional(),
  })
  .strict();

const orderByCndCategory = z.object({
  uf: z.enum(["asc", "desc"]).optional(),
  municipio: z.enum(["asc", "desc"]).optional(),
  id: z.enum(["asc", "desc"]).optional(),
  createdAt: z.enum(["asc", "desc"]).optional(),
});

const includeCndCategory = z.object({
  cndType: z.boolean().optional(),
  fornecedores: z
    .union([
      z.boolean(),
      z.object({
        where: z.lazy(() => whereFornecedorCategory).optional(),
        orderBy: z.lazy(() => orderByFornecedorCategory).optional(),
        include: z
          .object({
            fornecedor: z.boolean().optional(),
            cnds: z.boolean().optional(),
          })
          .optional(),
      }),
    ])
    .optional(),
});

const selectCndCategoryFields = {
  id: z.boolean().optional(),
  uf: z.boolean().optional(),
  municipio: z.boolean().optional(),
  cndTypeId: z.boolean().optional(),
  instructions: z.boolean().optional(),
  ativo: z.boolean().optional(),
  createdAt: z.boolean().optional(),
};

const selectCndCategory: z.ZodType<any> = z.object({
  ...selectCndCategoryFields,
  cndType: z
    .boolean()
    .or(z.lazy(() => z.object({ select: selectCndType })))
    .optional(),
  fornecedores: z
    .boolean()
    .or(
      z.lazy(() =>
        z.object({
          select: selectFornecedorCategory,
        }),
      ),
    )
    .optional(),
});

const queryCndCategory = z
  .object({
    where: whereCndCategory.optional(),
    orderBy: orderByCndCategory.optional(),
    include: includeCndCategory.optional(),
    limit: z.number().positive().max(50).optional(),
    page: z.number().int().min(1).optional(),
    select: selectCndCategory.optional(),
  })
  .refine((data) => !(data.limit && !data.page), {
    message: "page is required when limit is provided",
    path: ["page"],
  });

const newCndCategory = z
  .object({
    uf: z.string().optional(),
    municipio: z.string().optional(),
    cndTypeId: z.string(),
    instructions: z.record(z.string(), z.any()).optional(),
  })
  .strict();

const updateCndCategory = newCndCategory.partial();

export {
  queryCndCategory,
  whereCndCategory,
  orderByCndCategory,
  newCndCategory,
  updateCndCategory,
  selectCndCategory,
  selectCndCategoryFields,
};
