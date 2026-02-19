import * as z from "zod";
import { orderByCnd, whereCnd, selectCnd } from "./cnd.js";
import { selectCndCategory } from "./cndCategory.js";
import {
  whereFornecedorCategory,
  orderByFornecedorCategory,
} from "./fornecedorCategory.js";

const whereFornecedor = z
  .object({
    ativo: z.boolean().default(true).optional(),
    cnpj: z.string().optional(),
    name: z.string().optional(),
    uf: z.string().optional(),
    municipio: z.string().optional(),
    id: z.string().optional(),
  })
  .strict();

const orderByFornecedor = z.object({
  cnpj: z.enum(["asc", "desc"]).optional(),
  name: z.enum(["asc", "desc"]).optional(),
  uf: z.enum(["asc", "desc"]).optional(),
  municipio: z.enum(["asc", "desc"]).optional(),
  id: z.enum(["asc", "desc"]).optional(),
  createdAt: z.enum(["asc", "desc"]).optional(),
});

const includeFornecedor = z.object({
  categories: z.union([
    z.boolean(),
    z.object({
      where: z.lazy(() => whereFornecedorCategory).optional(),
      orderBy: z.lazy(() => orderByFornecedorCategory).optional(),
      include: z
        .object({
          cndCategory: z.boolean().optional(),
          cnds: z.boolean().optional(),
        })
        .optional(),
    }),
  ]),
});

const selectFornecedorFields = {
  id: z.boolean().optional(),
  cnpj: z.boolean().optional(),
  name: z.boolean().optional(),
  uf: z.boolean().optional(),
  municipio: z.boolean().optional(),
  ativo: z.boolean().optional(),
  createdAt: z.boolean().optional(),
};

const selectFornecedor: z.ZodType<any> = z.object({
  ...selectFornecedorFields,
  categories: z
    .boolean()
    .or(
      z.lazy(() =>
        z.object({
          select: z.object({
            id: z.boolean().optional(),
            fornecedorId: z.boolean().optional(),
            cndCategoryId: z.boolean().optional(),
            ativo: z.boolean().optional(),
            createdAt: z.boolean().optional(),
            cndCategory: z
              .boolean()
              .or(z.lazy(() => z.object({ select: selectCndCategory })))
              .optional(),
            cnds: z
              .boolean()
              .or(z.lazy(() => z.object({ select: selectCnd })))
              .optional(),
          }),
        }),
      ),
    )
    .optional(),
});

const queryFornecedor = z
  .object({
    where: whereFornecedor.optional(),
    orderBy: orderByFornecedor.optional(),
    include: includeFornecedor.optional(),
    limit: z.number().positive().max(50).optional(),
    page: z.number().int().min(1).optional(),
    select: selectFornecedor.optional(),
  })
  .refine((data) => !(data.limit && !data.page), {
    message: "page is required when limit is provided",
    path: ["page"],
  });

const newFornecedor = z
  .object({
    cnpj: z.string(),
    name: z.string(),
    uf: z.string().optional(),
    municipio: z.string().optional(),
  })
  .strict();

const updateFornecedor = newFornecedor.partial();

export {
  queryFornecedor,
  whereFornecedor,
  orderByFornecedor,
  newFornecedor,
  updateFornecedor,
  selectFornecedor,
  selectFornecedorFields,
};
