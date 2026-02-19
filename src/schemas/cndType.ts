import * as z from "zod";
import { whereCndCategory, orderByCndCategory } from "./cndCategory.js";
import { selectFornecedorCategory } from "./fornecedorCategory.js";

const whereCndType = z
  .object({
    ativo: z.boolean().default(true).optional(),
    tipo: z.string().optional(),
    id: z.string().optional(),
  })
  .strict();

const orderByCndType = z.object({
  tipo: z.enum(["asc", "desc"]).optional(),
  id: z.enum(["asc", "desc"]).optional(),
  createdAt: z.enum(["asc", "desc"]).optional(),
});

const includeCndType = z.object({
  categories: z.union([
    z.boolean(),
    z.object({
      where: z.lazy(() => whereCndCategory).optional(),
      orderBy: z.lazy(() => orderByCndCategory).optional(),
      include: z.object({
        fornecedores: z.boolean().optional(),
      }).optional(),
    }),
  ]),
});

const selectCndTypeFields = {
  id: z.boolean().optional(),
  tipo: z.boolean().optional(),
  ativo: z.boolean().optional(),
  createdAt: z.boolean().optional(),
};

const selectCndType: z.ZodType<any> = z.object({
  ...selectCndTypeFields,
  categories: z
    .boolean()
    .or(
      z.lazy(() =>
        z.object({
          select: z.object({
            id: z.boolean().optional(),
            uf: z.boolean().optional(),
            municipio: z.boolean().optional(),
            cndTypeId: z.boolean().optional(),
            instructions: z.boolean().optional(),
            ativo: z.boolean().optional(),
            createdAt: z.boolean().optional(),
            fornecedores: z
              .boolean()
              .or(z.lazy(() => z.object({ select: selectFornecedorCategory })))
              .optional(),
          }),
        }),
      ),
    )
    .optional(),
});

const queryCndType = z
  .object({
    where: whereCndType.optional(),
    orderBy: orderByCndType.optional(),
    include: includeCndType.optional(),
    limit: z.number().positive().max(50).optional(),
    page: z.number().int().min(1).optional(),
    select: selectCndType.optional(),
  })
  .refine(
    (data) => !(data.limit && !data.page),
    { message: "page is required when limit is provided", path: ["page"] }
  );

const newCndType = z
  .object({
    tipo: z.string(),
    diasRestantes: z.number().int().positive(),
  })
  .strict();

const updateCndType = newCndType.partial();

export {
  queryCndType,
  whereCndType,
  orderByCndType,
  newCndType,
  updateCndType,
  selectCndType,
  selectCndTypeFields,
};