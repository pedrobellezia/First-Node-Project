import * as z from "zod";
import { selectFornecedor } from "./fornecedor.js";
import { queryCndCategory, selectCndCategory } from "./cndCategory.js";
import { selectCnd, whereCnd, orderByCnd } from "./cnd.js";

const whereFornecedorCategory = z
  .object({
    ativo: z.boolean().optional(),
    fornecedorId: z.string().optional(),
    cndCategoryId: z.string().optional(),
    id: z.string().optional(),
  })
  .strict();

const orderByFornecedorCategory = z.object({
  createdAt: z.enum(["asc", "desc"]).optional(),
  id: z.enum(["asc", "desc"]).optional(),
});

const includeFornecedorCategory = z.object({
  fornecedor: z.boolean().optional(),
  // fiz de preguiça olhar isso aqui depois
  cndCategory: z
    .union([z.boolean(), z.object({ include: { cndType: z.boolean() } })])
    .optional(),
  cnds: z
    .union([
      z.boolean(),
      z.object({
        where: z.lazy(() => whereCnd).optional(),
        orderBy: z.lazy(() => orderByCnd).optional(),
      }),
    ])
    .optional(),
});

const selectFornecedorCategoryFields = {
  id: z.boolean().optional(),
  fornecedorId: z.boolean().optional(),
  cndCategoryId: z.boolean().optional(),
  ativo: z.boolean().optional(),
  createdAt: z.boolean().optional(),
};

const selectFornecedorCategory: z.ZodType<any> = z.object({
  ...selectFornecedorCategoryFields,
  fornecedor: z
    .boolean()
    .or(z.lazy(() => z.object({ select: selectFornecedor })))
    .optional(),
  cndCategory: z
    .boolean()
    .or(z.lazy(() => z.object({ select: selectCndCategory })))
    .optional(),
  cnds: z
    .boolean()
    .or(
      z.lazy(() =>
        z.object({
          select: selectCnd,
        }),
      ),
    )
    .optional(),
});

const queryFornecedorCategory = z
  .object({
    where: whereFornecedorCategory.optional(),
    orderBy: orderByFornecedorCategory.optional(),
    include: includeFornecedorCategory.optional(),
    limit: z.number().positive().max(50).optional(),
    page: z.number().int().min(1).optional(),
    select: selectFornecedorCategory.optional(),
  })
  .refine((data) => !(data.limit && !data.page), {
    message: "page is required when limit is provided",
    path: ["page"],
  });

const newFornecedorCategory = z
  .object({
    fornecedorId: z.string(),
    cndCategoryId: z.string(),
  })
  .strict();

const updateFornecedorCategory = newFornecedorCategory.partial();

export {
  queryFornecedorCategory,
  whereFornecedorCategory,
  orderByFornecedorCategory,
  newFornecedorCategory,
  updateFornecedorCategory,
  selectFornecedorCategory,
  selectFornecedorCategoryFields,
};
