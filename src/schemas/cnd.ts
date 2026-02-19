import * as z from "zod";
import { selectFornecedorCategory } from "./fornecedorCategory.js";

const whereCnd = z
  .object({
    id: z.string().optional(),
    fornecedorCategoryId: z.string().optional(),
    file_name: z.string().optional(),
    validade: z.date().optional(),
    vencido: z.boolean().optional(),
    ativo: z.boolean().default(true).optional(),
  })
  .strict();

const orderByCnd = z.object({
  validade: z.enum(["asc", "desc"]).optional(),
  createdAt: z.enum(["asc", "desc"]).optional(),
});

const includeCnd = z.object({
  fornecedorCategory: z.union([
    z.boolean(),
    z.object({
      include: z.object({
        fornecedor: z.boolean().optional(),
        cndCategory: z
          .boolean()
          .or(z.lazy(() => z.object({ include: { cndType: z.boolean() } })))
          .optional(),
      }),
    }),
  ]).optional(),
});

const selectCndFields = {
  id: z.boolean().optional(),
  fornecedorCategoryId: z.boolean().optional(),
  file_name: z.boolean().optional(),
  validade: z.boolean().optional(),
  ativo: z.boolean().optional(),
  createdAt: z.boolean().optional(),
};

const selectCnd: z.ZodType<any> = z.object({
  ...selectCndFields,
  fornecedorCategory: z
    .boolean()
    .or(z.lazy(() => z.object({ select: selectFornecedorCategory })))
    .optional(),
});

const queryCnd = z
  .object({
    where: whereCnd.optional(),
    orderBy: orderByCnd.optional(),
    include: includeCnd.optional(),
    limit: z.number().positive().max(50).optional(),
    page: z.number().int().min(1).optional(),
    select: selectCnd.optional(),
  })
  .refine(
    (data) => !(data.limit && !data.page),
    { message: "page is required when limit is provided", path: ["page"] }
  );

const newCnd = z
  .object({
    fornecedorCategoryId: z.string()
  })
  .strict();

const updateCnd = newCnd.partial();

export {
  queryCnd,
  whereCnd,
  orderByCnd,
  newCnd,
  updateCnd,
  selectCnd,
  selectCndFields,
};